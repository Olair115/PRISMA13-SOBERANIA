const { extractBearerToken } = require("../src/auth");
const { normalizeAppleHealthPayload } = require("../src/appleHealth");
const {
  buildAggregateRequest,
  buildGoogleFitAuthUrl,
  parseGoogleFitAggregate,
} = require("../src/googleFit");

describe("auth helpers", () => {
  test("extrai bearer token valido", () => {
    expect(extractBearerToken("Bearer abc123")).toBe("abc123");
    expect(extractBearerToken("bearer xyz")).toBe("xyz");
    expect(extractBearerToken("Basic xyz")).toBeNull();
  });
});

describe("Google Fit helpers", () => {
  test("monta URL OAuth com state e escopos", () => {
    const url = new URL(buildGoogleFitAuthUrl({
      clientId: "client",
      redirectUri: "https://example.test/callback",
      scopes: ["scope-a", "scope-b"],
      state: "state-1",
    }));

    expect(url.searchParams.get("client_id")).toBe("client");
    expect(url.searchParams.get("state")).toBe("state-1");
    expect(url.searchParams.get("scope")).toBe("scope-a scope-b");
  });

  test("monta payload aggregate na janela informada", () => {
    const payload = buildAggregateRequest({
      startTimeMillis: 1000,
      endTimeMillis: 2000,
    });

    expect(payload.startTimeMillis).toBe(1000);
    expect(payload.endTimeMillis).toBe(2000);
    expect(payload.aggregateBy).toHaveLength(3);
  });

  test("resume buckets aggregate de steps, calorias e batimentos", () => {
    const summary = parseGoogleFitAggregate({
      bucket: [{
        dataset: [
          {
            dataSourceId: "derived:com.google.step_count.delta",
            point: [{ value: [{ intVal: 1200 }] }],
          },
          {
            dataSourceId: "derived:com.google.calories.expended",
            point: [{ value: [{ fpVal: 80.5 }] }],
          },
          {
            dataSourceId: "derived:com.google.heart_rate.bpm",
            point: [{ value: [{ fpVal: 70 }, { fpVal: 74 }] }],
          },
        ],
      }],
    });

    expect(summary.steps).toBe(1200);
    expect(summary.calories).toBe(80.5);
    expect(summary.heartRateBpm).toBe(72);
  });
});

describe("Apple Health helpers", () => {
  test("normaliza importacao HealthKit", () => {
    const payload = normalizeAppleHealthPayload({
      device: "iPhone",
      samples: [{
        type: "stepCount",
        value: 3200,
        unit: "count",
        startDate: "2026-05-08T10:00:00.000Z",
        endDate: "2026-05-08T11:00:00.000Z",
      }],
    });

    expect(payload.source).toBe("apple-healthkit");
    expect(payload.samples).toHaveLength(1);
    expect(payload.summary.stepCount.total).toBe(3200);
  });
});
