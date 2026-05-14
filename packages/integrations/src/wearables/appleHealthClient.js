function createAppleHealthBridge({ client }) {
  if (!client || typeof client.importAppleHealth !== "function") {
    throw new Error("Health data client real e obrigatorio.");
  }

  return {
    importSamples(samples, summary = {}) {
      return client.importAppleHealth({
        source: "apple-healthkit",
        samples,
        summary,
      });
    },
  };
}

module.exports = { createAppleHealthBridge };
