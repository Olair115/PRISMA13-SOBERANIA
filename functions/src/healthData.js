const { requireFirebaseUser } = require("./auth");
const {
  assertMethod,
  readJsonBody,
  sendJson,
  withCors,
} = require("./http");
const {
  aggregateGoogleFit,
  buildGoogleFitAuthUrl,
  createOAuthState,
  exchangeGoogleFitCode,
  readGoogleFitConfig,
  refreshGoogleFitToken,
  tokenNeedsRefresh,
} = require("./googleFit");
const { normalizeAppleHealthPayload } = require("./appleHealth");

const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;

function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  return new Date(value);
}

function createHealthHandlers({ admin, fetchImpl = fetch }) {
  const db = admin.firestore();
  const auth = admin.auth();
  const timestamp = admin.firestore.FieldValue.serverTimestamp;

  async function authUser(req) {
    return requireFirebaseUser(req, auth);
  }

  async function healthData(req, res) {
    assertMethod(req, ["GET"]);
    const user = await authUser(req);
    const userRef = db.collection("usuarios").doc(user.uid);
    const [profile, googleFit, appleHealth] = await Promise.all([
      userRef.get(),
      userRef.collection("wearables").doc("googleFit").get(),
      userRef.collection("wearables").doc("appleHealth").get(),
    ]);

    sendJson(res, 200, {
      ok: true,
      uid: user.uid,
      profile: profile.exists ? profile.data() : null,
      wearables: {
        googleFit: googleFit.exists ? googleFit.data().latest || null : null,
        appleHealth: appleHealth.exists ? appleHealth.data().latest || null : null,
      },
    });
  }

  async function googleFitConnect(req, res) {
    assertMethod(req, ["GET", "POST"]);
    const user = await authUser(req);
    const config = readGoogleFitConfig();
    const state = createOAuthState();
    const expiresAt = new Date(Date.now() + OAUTH_STATE_TTL_MS);

    await db.collection("oauthStates").doc(state).set({
      uid: user.uid,
      provider: "googleFit",
      createdAt: timestamp(),
      expiresAt,
    });

    sendJson(res, 200, {
      ok: true,
      provider: "googleFit",
      state,
      authUrl: buildGoogleFitAuthUrl({
        clientId: config.clientId,
        redirectUri: config.redirectUri,
        scopes: config.scopes,
        state,
      }),
    });
  }

  async function googleFitCallback(req, res) {
    assertMethod(req, ["GET"]);
    const code = req.query.code;
    const state = req.query.state;

    if (!code || !state) {
      const error = new Error("Callback Google Fit incompleto.");
      error.status = 400;
      throw error;
    }

    const stateRef = db.collection("oauthStates").doc(String(state));
    const stateSnap = await stateRef.get();
    if (!stateSnap.exists) {
      const error = new Error("Estado OAuth Google Fit invalido.");
      error.status = 400;
      throw error;
    }

    const stateData = stateSnap.data();
    const expiresAt = toDate(stateData.expiresAt);
    if (!expiresAt || expiresAt.getTime() < Date.now()) {
      await stateRef.delete();
      const error = new Error("Estado OAuth Google Fit expirado.");
      error.status = 400;
      throw error;
    }

    const config = readGoogleFitConfig();
    const token = await exchangeGoogleFitCode({
      code: String(code),
      config,
      fetchImpl,
    });

    await db
      .collection("usuarios")
      .doc(stateData.uid)
      .collection("integrations")
      .doc("googleFit")
      .set({
        ...token,
        provider: "googleFit",
        updatedAt: timestamp(),
      }, { merge: true });

    await stateRef.delete();

    res.status(200).type("html").send(`<!doctype html>
<html lang="pt-BR">
<meta charset="utf-8">
<title>PRISMA13 - Google Fit conectado</title>
<body style="background:#000;color:#fff;font-family:Arial;padding:40px">
<h1>Google Fit conectado ao PRISMA13.</h1>
<p>Pode fechar esta janela e voltar ao app.</p>
</body>
</html>`);
  }

  async function googleFitSync(req, res) {
    assertMethod(req, ["POST"]);
    const user = await authUser(req);
    const body = readJsonBody(req);
    const endTimeMillis = Number(body.endTimeMillis || Date.now());
    const startTimeMillis = Number(
      body.startTimeMillis || endTimeMillis - 24 * 60 * 60 * 1000,
    );

    const integrationRef = db
      .collection("usuarios")
      .doc(user.uid)
      .collection("integrations")
      .doc("googleFit");
    const integrationSnap = await integrationRef.get();

    if (!integrationSnap.exists) {
      const error = new Error("Google Fit ainda nao conectado.");
      error.status = 409;
      throw error;
    }

    const config = readGoogleFitConfig();
    let token = integrationSnap.data();
    if (tokenNeedsRefresh(token)) {
      token = await refreshGoogleFitToken({ token, config, fetchImpl });
      await integrationRef.set({ ...token, updatedAt: timestamp() }, { merge: true });
    }

    const result = await aggregateGoogleFit({
      token,
      range: { startTimeMillis, endTimeMillis },
      fetchImpl,
    });

    const wearableRef = db
      .collection("usuarios")
      .doc(user.uid)
      .collection("wearables")
      .doc("googleFit");
    const snapshotRef = await wearableRef.collection("snapshots").add({
      provider: "googleFit",
      range: { startTimeMillis, endTimeMillis },
      summary: result.summary,
      raw: result.raw,
      createdAt: timestamp(),
    });

    await wearableRef.set({
      latest: {
        snapshotId: snapshotRef.id,
        range: { startTimeMillis, endTimeMillis },
        summary: result.summary,
      },
      updatedAt: timestamp(),
    }, { merge: true });

    sendJson(res, 200, { ok: true, provider: "googleFit", summary: result.summary });
  }

  async function appleHealthImport(req, res) {
    assertMethod(req, ["POST"]);
    const user = await authUser(req);
    const payload = normalizeAppleHealthPayload(readJsonBody(req));
    const wearableRef = db
      .collection("usuarios")
      .doc(user.uid)
      .collection("wearables")
      .doc("appleHealth");

    const snapshotRef = await wearableRef.collection("snapshots").add({
      ...payload,
      createdAt: timestamp(),
    });

    await wearableRef.set({
      latest: {
        snapshotId: snapshotRef.id,
        importedAt: payload.importedAt,
        summary: payload.summary,
        sampleCount: payload.samples.length,
      },
      updatedAt: timestamp(),
    }, { merge: true });

    sendJson(res, 200, {
      ok: true,
      provider: "appleHealth",
      snapshotId: snapshotRef.id,
      sampleCount: payload.samples.length,
      summary: payload.summary,
    });
  }

  return {
    appleHealthImport: withCors(appleHealthImport),
    googleFitCallback: withCors(googleFitCallback),
    googleFitConnect: withCors(googleFitConnect),
    googleFitSync: withCors(googleFitSync),
    healthData: withCors(healthData),
  };
}

module.exports = {
  createHealthHandlers,
};
