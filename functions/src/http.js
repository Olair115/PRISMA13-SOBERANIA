function allowedOrigin() {
  return process.env.PRISMA13_ALLOWED_ORIGIN || "*";
}

function setCorsHeaders(req, res) {
  const requestOrigin = req.headers.origin;
  const configuredOrigin = allowedOrigin();
  const origin = configuredOrigin === "*" ? (requestOrigin || "*") : configuredOrigin;

  res.set("Access-Control-Allow-Origin", origin);
  res.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.set("Access-Control-Max-Age", "3600");
}

function sendJson(res, status, payload) {
  res.status(status).json(payload);
}

function sendError(res, error) {
  const status = error.status || 500;
  const message = status >= 500 ? "Erro interno PRISMA13." : error.message;
  sendJson(res, status, { ok: false, error: message });
}

function withCors(handler) {
  return async (req, res) => {
    setCorsHeaders(req, res);

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    try {
      await handler(req, res);
    } catch (error) {
      console.error(error);
      sendError(res, error);
    }
  };
}

function readJsonBody(req) {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return req.body;
  }

  if (typeof req.body === "string" && req.body.trim()) {
    return JSON.parse(req.body);
  }

  if (Buffer.isBuffer(req.rawBody) && req.rawBody.length) {
    return JSON.parse(req.rawBody.toString("utf8"));
  }

  return {};
}

function assertMethod(req, methods) {
  if (!methods.includes(req.method)) {
    const error = new Error("Metodo nao permitido.");
    error.status = 405;
    throw error;
  }
}

module.exports = {
  assertMethod,
  readJsonBody,
  sendJson,
  withCors,
};
