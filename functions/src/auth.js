function extractBearerToken(header) {
  if (!header || typeof header !== "string") return null;
  const parts = header.trim().split(/\s+/);
  if (parts.length !== 2) return null;
  if (!/^Bearer$/i.test(parts[0])) return null;
  return parts[1] || null;
}

async function requireFirebaseUser(req, auth) {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    const error = new Error("Token Firebase ausente.");
    error.status = 401;
    throw error;
  }

  try {
    return await auth.verifyIdToken(token);
  } catch (cause) {
    const error = new Error("Token Firebase invalido.");
    error.status = 401;
    error.cause = cause;
    throw error;
  }
}

module.exports = {
  extractBearerToken,
  requireFirebaseUser,
};
