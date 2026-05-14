const MAX_SAMPLES_PER_IMPORT = 5000;

function assertValidDate(value, field) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) {
    const error = new Error(`Apple Health: ${field} invalido.`);
    error.status = 400;
    throw error;
  }
  return date.toISOString();
}

function normalizeSample(sample) {
  if (!sample || typeof sample !== "object") {
    const error = new Error("Apple Health: sample invalido.");
    error.status = 400;
    throw error;
  }

  const value = Number(sample.value);
  if (!Number.isFinite(value)) {
    const error = new Error("Apple Health: value invalido.");
    error.status = 400;
    throw error;
  }

  return {
    type: String(sample.type || "").trim(),
    value,
    unit: String(sample.unit || "").trim(),
    startDate: assertValidDate(sample.startDate, "startDate"),
    endDate: assertValidDate(sample.endDate || sample.startDate, "endDate"),
    sourceName: sample.sourceName ? String(sample.sourceName).slice(0, 120) : null,
  };
}

function summarizeSamples(samples) {
  return samples.reduce((summary, sample) => {
    if (!summary[sample.type]) {
      summary[sample.type] = { count: 0, total: 0, unit: sample.unit };
    }
    summary[sample.type].count += 1;
    summary[sample.type].total += sample.value;
    return summary;
  }, {});
}

function normalizeAppleHealthPayload(body = {}) {
  const samples = Array.isArray(body.samples) ? body.samples : [];

  if (!samples.length) {
    const error = new Error("Apple Health: samples obrigatorios.");
    error.status = 400;
    throw error;
  }

  if (samples.length > MAX_SAMPLES_PER_IMPORT) {
    const error = new Error("Apple Health: importacao excede limite.");
    error.status = 413;
    throw error;
  }

  const normalizedSamples = samples.map(normalizeSample);

  return {
    source: "apple-healthkit",
    importedAt: new Date().toISOString(),
    device: body.device ? String(body.device).slice(0, 120) : null,
    summary: {
      ...summarizeSamples(normalizedSamples),
      ...(body.summary && typeof body.summary === "object" ? body.summary : {}),
    },
    samples: normalizedSamples,
  };
}

module.exports = {
  normalizeAppleHealthPayload,
};
