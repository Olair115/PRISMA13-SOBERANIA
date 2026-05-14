const PRISMA13_DIMENSIONS = [
  { id: "fisica", order: 1, title: "Saude Fisica", unit: "Vigor" },
  { id: "mental", order: 2, title: "Saude Mental", unit: "Clareza" },
  { id: "relacionamentos", order: 3, title: "Relacionamentos", unit: "Vinculo" },
  { id: "carreira", order: 4, title: "Carreira Profissional", unit: "Direcao" },
  { id: "financas", order: 5, title: "Financas", unit: "Suficiencia" },
  { id: "espiritualidade", order: 6, title: "Espiritualidade", unit: "Sentido" },
  { id: "lazer", order: 7, title: "Lazer e Recreacao", unit: "Fruicao" },
  { id: "aprendizado", order: 8, title: "Aprendizado", unit: "Maestria" },
  { id: "contribuicao", order: 9, title: "Contribuicao", unit: "Impacto" },
  { id: "ambiente", order: 10, title: "Meio Ambiente", unit: "Ecologia" },
  { id: "familia", order: 11, title: "Familia", unit: "Laco" },
  { id: "comunidade", order: 12, title: "Comunidade", unit: "Pertencimento" },
  { id: "longevidade", order: 13, title: "Longevidade", unit: "Expressao" },
];

const PRISMA13_LEVELS = [
  "Sinal minimo",
  "Pulso frio",
  "Retomada inicial",
  "Abertura delicada",
  "Ritmo brando",
  "Centro funcional",
  "Presenca estavel",
  "Compromisso ativo",
  "Forca crescente",
  "Potencia viva",
  "Coerencia alta",
  "Integracao intensa",
  "Expansao solar",
];

function clampScore(score) {
  const value = Number(score);
  if (!Number.isFinite(value)) return 1;
  return Math.min(13, Math.max(1, Math.round(value)));
}

function scoreBand(score) {
  const value = clampScore(score);
  if (value <= 4) {
    return { id: "retracao", label: "Retracao", description: "cuidado inicial" };
  }
  if (value <= 8) {
    return { id: "funcional", label: "Funcional", description: "ritmo em reorganizacao" };
  }
  return { id: "expansao", label: "Expansao", description: "vitalidade integrada" };
}

function averageScores(scores) {
  const values = Object.values(scores || {})
    .map(Number)
    .filter((value) => Number.isFinite(value));

  if (!values.length) return 0;
  const total = values.reduce((sum, value) => sum + clampScore(value), 0);
  return Number((total / values.length).toFixed(2));
}

function buildHealthSnapshot(input = {}) {
  const manualScores = input.manualScores || {};
  const wearableSummary = input.wearableSummary || {};
  const average = averageScores(manualScores);

  return {
    createdAt: input.createdAt || new Date().toISOString(),
    manualScores,
    wearableSummary,
    average,
    band: average ? scoreBand(average) : null,
  };
}

module.exports = {
  PRISMA13_DIMENSIONS,
  PRISMA13_LEVELS,
  averageScores,
  buildHealthSnapshot,
  clampScore,
  scoreBand,
};
