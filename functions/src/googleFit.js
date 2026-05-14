const crypto = require("crypto");

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const AGGREGATE_URL = "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate";
const DEFAULT_SCOPES = [
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.heart_rate.read",
  "https://www.googleapis.com/auth/fitness.sleep.read",
];

function createOAuthState() {
  return crypto.randomBytes(24).toString("hex");
}

function readGoogleFitConfig() {
  const clientId = process.env.GOOGLE_FIT_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_FIT_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_FIT_REDIRECT_URI;
  const scopes = (process.env.GOOGLE_FIT_SCOPES || DEFAULT_SCOPES.join(" "))
    .split(/\s+/)
    .filter(Boolean);

  if (!clientId || !clientSecret || !redirectUri) {
    const error = new Error("Google Fit OAuth nao configurado.");
    error.status = 500;
    throw error;
  }

  return { clientId, clientSecret, redirectUri, scopes };
}

function buildGoogleFitAuthUrl({ clientId, redirectUri, scopes, state }) {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("state", state);
  url.searchParams.set("scope", scopes.join(" "));
  return url.toString();
}

async function exchangeGoogleFitCode({ code, config, fetchImpl = fetch }) {
  const body = new URLSearchParams({
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
    grant_type: "authorization_code",
  });

  const response = await fetchImpl(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const payload = await response.json();
  if (!response.ok) {
    const error = new Error(payload.error_description || "Falha no OAuth Google Fit.");
    error.status = 502;
    throw error;
  }

  return normalizeTokenPayload(payload);
}

async function refreshGoogleFitToken({ token, config, fetchImpl = fetch }) {
  if (!token.refreshToken) {
    const error = new Error("Refresh token Google Fit ausente.");
    error.status = 409;
    throw error;
  }

  const body = new URLSearchParams({
    refresh_token: token.refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: "refresh_token",
  });

  const response = await fetchImpl(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const payload = await response.json();
  if (!response.ok) {
    const error = new Error(payload.error_description || "Falha ao renovar Google Fit.");
    error.status = 502;
    throw error;
  }

  return {
    ...token,
    ...normalizeTokenPayload(payload),
    refreshToken: token.refreshToken,
  };
}

function normalizeTokenPayload(payload) {
  const expiresIn = Number(payload.expires_in || 3600);
  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token || null,
    scope: payload.scope || null,
    tokenType: payload.token_type || "Bearer",
    expiresAt: Date.now() + expiresIn * 1000,
  };
}

function tokenNeedsRefresh(token) {
  return !token.accessToken || Number(token.expiresAt || 0) < Date.now() + 60000;
}

function buildAggregateRequest({ startTimeMillis, endTimeMillis }) {
  return {
    startTimeMillis,
    endTimeMillis,
    aggregateBy: [
      { dataTypeName: "com.google.step_count.delta" },
      { dataTypeName: "com.google.calories.expended" },
      { dataTypeName: "com.google.heart_rate.bpm" },
    ],
    bucketByTime: { durationMillis: 86400000 },
  };
}

async function aggregateGoogleFit({ token, range, fetchImpl = fetch }) {
  const response = await fetchImpl(AGGREGATE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildAggregateRequest(range)),
  });

  const payload = await response.json();
  if (!response.ok) {
    const error = new Error(payload.error?.message || "Falha ao ler Google Fit.");
    error.status = 502;
    throw error;
  }

  return {
    raw: payload,
    summary: parseGoogleFitAggregate(payload),
  };
}

function pointValues(point) {
  return (point.value || []).map((item) => {
    if (item.intVal !== undefined) return Number(item.intVal);
    if (item.fpVal !== undefined) return Number(item.fpVal);
    return 0;
  });
}

function parseGoogleFitAggregate(payload = {}) {
  const summary = {
    steps: 0,
    calories: 0,
    heartRateBpm: null,
    buckets: Array.isArray(payload.bucket) ? payload.bucket.length : 0,
  };
  const heartValues = [];

  for (const bucket of payload.bucket || []) {
    for (const dataset of bucket.dataset || []) {
      const source = String(dataset.dataSourceId || "");
      const values = (dataset.point || []).flatMap(pointValues);
      const total = values.reduce((sum, value) => sum + value, 0);

      if (source.includes("step_count")) summary.steps += total;
      if (source.includes("calories")) summary.calories += total;
      if (source.includes("heart_rate")) heartValues.push(...values);
    }
  }

  if (heartValues.length) {
    const totalHeart = heartValues.reduce((sum, value) => sum + value, 0);
    summary.heartRateBpm = Number((totalHeart / heartValues.length).toFixed(1));
  }

  summary.steps = Math.round(summary.steps);
  summary.calories = Number(summary.calories.toFixed(2));
  return summary;
}

module.exports = {
  aggregateGoogleFit,
  buildAggregateRequest,
  buildGoogleFitAuthUrl,
  createOAuthState,
  exchangeGoogleFitCode,
  parseGoogleFitAggregate,
  readGoogleFitConfig,
  refreshGoogleFitToken,
  tokenNeedsRefresh,
};
