function createGoogleFitBridge({ client, locationRef = globalThis.location }) {
  if (!client || typeof client.startGoogleFitConnection !== "function") {
    throw new Error("Health data client real e obrigatorio.");
  }

  return {
    async connect() {
      const payload = await client.startGoogleFitConnection();
      if (!payload.authUrl) {
        throw new Error("URL OAuth do Google Fit nao retornada.");
      }
      locationRef.href = payload.authUrl;
      return payload;
    },

    sync(range) {
      return client.syncGoogleFit(range);
    },
  };
}

module.exports = { createGoogleFitBridge };
