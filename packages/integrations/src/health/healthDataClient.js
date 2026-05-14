function joinUrl(baseUrl, path) {
  const base = String(baseUrl || "").replace(/\/$/, "");
  return `${base}${path}`;
}

function createHealthDataClient({ baseUrl = "", getIdToken, fetchImpl = fetch }) {
  if (typeof getIdToken !== "function") {
    throw new Error("getIdToken real e obrigatorio para health data.");
  }

  async function authorizedFetch(path, options = {}) {
    const token = await getIdToken();
    if (!token) {
      throw new Error("Pessoa usuaria nao autenticada.");
    }

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    };

    const response = await fetchImpl(joinUrl(baseUrl, path), {
      ...options,
      headers,
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || `HTTP ${response.status}`);
    }
    return payload;
  }

  return {
    getHealthData() {
      return authorizedFetch("/api/health-data", { method: "GET" });
    },

    startGoogleFitConnection() {
      return authorizedFetch("/api/google-fit/connect", { method: "POST" });
    },

    syncGoogleFit(range = {}) {
      return authorizedFetch("/api/google-fit/sync", {
        method: "POST",
        body: JSON.stringify(range),
      });
    },

    importAppleHealth(payload) {
      return authorizedFetch("/api/apple-health/import", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
  };
}

module.exports = { createHealthDataClient };
