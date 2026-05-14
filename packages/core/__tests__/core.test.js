const {
  averageScores,
  buildHealthSnapshot,
  clampScore,
  scoreBand,
} = require("../src");

describe("@prisma13/core", () => {
  test("normaliza escores para a escala 1 a 13", () => {
    expect(clampScore(0)).toBe(1);
    expect(clampScore(14)).toBe(13);
    expect(clampScore(7.4)).toBe(7);
  });

  test("calcula bandas visuais da escala PRISMA13", () => {
    expect(scoreBand(3).id).toBe("retracao");
    expect(scoreBand(7).id).toBe("funcional");
    expect(scoreBand(11).id).toBe("expansao");
  });

  test("gera snapshot integrando leitura manual e wearables", () => {
    const snapshot = buildHealthSnapshot({
      createdAt: "2026-05-08T00:00:00.000Z",
      manualScores: { fisica: 5, mental: 9 },
      wearableSummary: { steps: 6400 },
    });

    expect(snapshot.average).toBe(7);
    expect(snapshot.band.id).toBe("funcional");
    expect(snapshot.wearableSummary.steps).toBe(6400);
  });

  test("retorna media zero quando nao ha escores validos", () => {
    expect(averageScores({ fisica: "x" })).toBe(0);
  });
});
