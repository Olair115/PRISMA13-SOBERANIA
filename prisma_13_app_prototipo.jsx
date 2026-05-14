import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Brain,
  Leaf,
  Moon,
  Utensils,
  Droplets,
  Wind,
  Users,
  Sun,
  HeartPulse,
  MapPin,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

const faixa = (valor) => {
  if (valor <= 4) return { nome: "Retração", descricao: "baixa ativação / cuidado inicial" };
  if (valor <= 8) return { nome: "Funcional", descricao: "ritmo em reorganização" };
  return { nome: "Expansão", descricao: "alta vitalidade / integração" };
};

const compromisso = [
  "Vibração mínima",
  "Pulso incipiente",
  "Sinal embrionário",
  "Abertura fria",
  "Retomada leve",
  "Compromisso brando",
  "Centro funcional",
  "Presença consistente",
  "Entrega crescente",
  "Força ativa",
  "Engajamento intenso",
  "Alta coerência",
  "Expansão solar",
];

const dimensions = [
  {
    id: "fisica",
    n: "01",
    title: "Saúde Física",
    unit: "Vigor",
    icon: Activity,
    color: "cyan",
    subtitle: "corpo / movimento / reparo",
    action: "Fixar vigor físico",
    levels: [
      "Frio Absoluto",
      "Gélido",
      "Contraído",
      "Frio",
      "Fresco",
      "Brando",
      "Morno",
      "Ativo",
      "Aquecido",
      "Quente",
      "Ardente",
      "Incandescente",
      "Solar",
    ],
  },
  {
    id: "mental",
    n: "02",
    title: "Saúde Mental",
    unit: "Clareza",
    icon: Brain,
    color: "violet",
    subtitle: "psique / sentido / direção",
    action: "Integrar psique",
    levels: [
      "Frio Absoluto",
      "Névoa Densa",
      "Sombra Ativa",
      "Angústia Fria",
      "Fresta de Sentido",
      "Clareza Branda",
      "Centro Estável",
      "Mente Acesa",
      "Sentido Quente",
      "Foco Profundo",
      "Sombra Integrada",
      "Lucidez Incandescente",
      "Mente Solar",
    ],
  },
  {
    id: "sono",
    n: "03",
    title: "Sono Regenerativo",
    unit: "Regeneração",
    icon: Moon,
    color: "emerald",
    subtitle: "sono / pausa / reparo vagal",
    action: "Fixar sono diário",
    levels: [
      "Colapso Seco",
      "Reserva Zerada",
      "Pausa Quebrada",
      "Sono Frio",
      "Respiro Leve",
      "Descanso Brando",
      "Recarga Estável",
      "Vagal Aceso",
      "Fonte Quente",
      "Restauração Profunda",
      "Silêncio Ardente",
      "Regeneração Incandescente",
      "Fonte Solar",
    ],
  },
  {
    id: "nutricao",
    n: "04",
    title: "Nutrição PNEI",
    unit: "Nutriente",
    icon: Utensils,
    color: "amber",
    subtitle: "alimento / cultura / metabolismo",
    action: "Alinhar nutriente",
    levels: [
      "Solo Seco",
      "Fome Oculta",
      "Prato Disperso",
      "Ritmo Frio",
      "Semente Leve",
      "Mesa Branda",
      "Prato Estável",
      "Nutrição Acesa",
      "Metabolismo Quente",
      "Cultura Viva",
      "Alimento Ardente",
      "Integração Incandescente",
      "Nutriente Solar",
    ],
  },
  {
    id: "ar",
    n: "05",
    title: "Ar Limpo",
    unit: "Sopro",
    icon: Wind,
    color: "sky",
    subtitle: "respiração / bioma / estado vagal",
    action: "Fixar frequência respiratória",
    levels: [
      "Ar Denso",
      "Ar Pesado",
      "Ar Fechado",
      "Ar Frio",
      "Fresta de Ar",
      "Brisa Branda",
      "Ar Respirável",
      "Ar Limpo",
      "Sopro Quente",
      "Pulmão Aberto",
      "Brisa Ardente",
      "Sopro Incandescente",
      "Sopro Vital",
    ],
  },
  {
    id: "agua",
    n: "06",
    title: "Hidratação",
    unit: "Fluxo",
    icon: Droplets,
    color: "blue",
    subtitle: "água / circulação / fluidez",
    action: "Regular fluxo hídrico",
    levels: [
      "Secura Total",
      "Reserva Baixa",
      "Sede Oculta",
      "Fluxo Frio",
      "Gole Leve",
      "Hidratação Branda",
      "Fluxo Estável",
      "Água Acesa",
      "Circulação Quente",
      "Fluidez Viva",
      "Corrente Ardente",
      "Fluxo Incandescente",
      "Fonte Solar",
    ],
  },
  {
    id: "atividade",
    n: "07",
    title: "Tríade de Atividade",
    unit: "Compromisso",
    icon: Sun,
    color: "yellow",
    subtitle: "física / intelectual / social",
    action: "Sincronizar ritmos",
    levels: [
      "Parado Total",
      "Sinal Mínimo",
      "Movimento Raro",
      "Ritmo Frio",
      "Retomada Leve",
      "Compromisso Brando",
      "Centro Funcional",
      "Ritmo Aceso",
      "Entrega Quente",
      "Potência Viva",
      "Ritmo Ardente",
      "Sincronia Incandescente",
      "Ritmo Solar",
    ],
  },
  {
    id: "social",
    n: "08",
    title: "Vínculo Social",
    unit: "Vínculo",
    icon: Users,
    color: "orange",
    subtitle: "interação / comunidade / pertencimento",
    action: "Fortalecer vínculo",
    levels: [
      "Casulo Fechado",
      "Sinal Distante",
      "Voz Baixa",
      "Contato Frio",
      "Abertura Leve",
      "Troca Branda",
      "Presença Estável",
      "Vínculo Aceso",
      "Circulação Quente",
      "Comunidade Viva",
      "Influência Ardente",
      "Rede Incandescente",
      "Comunhão Solar",
    ],
  },
  {
    id: "local",
    n: "09",
    title: "Local & Lugar",
    unit: "Pertencimento",
    icon: MapPin,
    color: "rose",
    subtitle: "CEP / território / cultura",
    action: "Mapear território vital",
    levels: [
      "Sem Chão",
      "Lugar Distante",
      "Morada Frágil",
      "CEP Frio",
      "Raiz Leve",
      "Base Branda",
      "Território Estável",
      "Lugar Aceso",
      "Cultura Quente",
      "Morada Viva",
      "Raiz Ardente",
      "Território Incandescente",
      "Pertencimento Solar",
    ],
  },
  {
    id: "emocional",
    n: "10",
    title: "Saúde Emocional",
    unit: "Regulação",
    icon: HeartPulse,
    color: "pink",
    subtitle: "afeto / tensão / autorregulação",
    action: "Regular emoção",
    levels: [
      "Afeto Congelado",
      "Tensão Densa",
      "Reação Bruta",
      "Emoção Fria",
      "Sinal Afetivo",
      "Escuta Branda",
      "Centro Emocional",
      "Afeto Aceso",
      "Regulação Quente",
      "Coração Vivo",
      "Coragem Ardente",
      "Afeto Incandescente",
      "Coração Solar",
    ],
  },
  {
    id: "protecao",
    n: "11",
    title: "Segurança Biológica",
    unit: "Proteção",
    icon: ShieldCheck,
    color: "lime",
    subtitle: "rotina / ambiente / prevenção",
    action: "Fixar proteção",
    levels: [
      "Exposto Total",
      "Alerta Baixo",
      "Risco Difuso",
      "Abrigo Frio",
      "Cuidado Leve",
      "Proteção Branda",
      "Base Segura",
      "Ambiente Aceso",
      "Defesa Quente",
      "Rotina Viva",
      "Proteção Ardente",
      "Blindagem Incandescente",
      "Segurança Solar",
    ],
  },
  {
    id: "proposito",
    n: "12",
    title: "Propósito",
    unit: "Sentido",
    icon: Sparkles,
    color: "fuchsia",
    subtitle: "direção / valor / escolha",
    action: "Acender sentido",
    levels: [
      "Vazio Frio",
      "Busca Difusa",
      "Dúvida Densa",
      "Sentido Frio",
      "Fresta de Valor",
      "Direção Branda",
      "Eixo Estável",
      "Propósito Aceso",
      "Sentido Quente",
      "Missão Viva",
      "Vocação Ardente",
      "Sentido Incandescente",
      "Propósito Solar",
    ],
  },
  {
    id: "longevidade",
    n: "13",
    title: "Longevidade",
    unit: "Vigor Juvenil",
    icon: Leaf,
    color: "green",
    subtitle: "vida longa / reparo / consistência",
    action: "Elevar longevidade",
    levels: [
      "Tempo Pesado",
      "Reserva Curta",
      "Ritmo Cansado",
      "Vigor Frio",
      "Vida em Retomada",
      "Constância Branda",
      "Vigor Estável",
      "Juventude Acesa",
      "Tempo Quente",
      "Vida Viva",
      "Vigor Ardente",
      "Longevidade Incandescente",
      "Vigor Solar",
    ],
  },
];

const colorClasses = {
  cyan: "from-cyan-400 to-cyan-200 text-cyan-200 border-cyan-400/30 shadow-cyan-400/10",
  violet: "from-violet-400 to-fuchsia-200 text-violet-200 border-violet-400/30 shadow-violet-400/10",
  emerald: "from-emerald-400 to-lime-200 text-emerald-200 border-emerald-400/30 shadow-emerald-400/10",
  amber: "from-amber-300 to-orange-200 text-amber-200 border-amber-400/30 shadow-amber-400/10",
  sky: "from-sky-300 to-cyan-100 text-sky-200 border-sky-400/30 shadow-sky-400/10",
  blue: "from-blue-400 to-cyan-200 text-blue-200 border-blue-400/30 shadow-blue-400/10",
  yellow: "from-yellow-300 to-amber-200 text-yellow-200 border-yellow-400/30 shadow-yellow-400/10",
  orange: "from-orange-400 to-yellow-200 text-orange-200 border-orange-400/30 shadow-orange-400/10",
  rose: "from-rose-400 to-orange-200 text-rose-200 border-rose-400/30 shadow-rose-400/10",
  pink: "from-pink-400 to-rose-200 text-pink-200 border-pink-400/30 shadow-pink-400/10",
  lime: "from-lime-300 to-emerald-200 text-lime-200 border-lime-400/30 shadow-lime-400/10",
  fuchsia: "from-fuchsia-400 to-violet-200 text-fuchsia-200 border-fuchsia-400/30 shadow-fuchsia-400/10",
  green: "from-green-400 to-lime-200 text-green-200 border-green-400/30 shadow-green-400/10",
};

function DimensionCard({ dim, value, onChange }) {
  const Icon = dim.icon;
  const f = faixa(value);
  const current = dim.levels[value - 1];
  const color = colorClasses[dim.color];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border bg-white/[0.035] p-4 shadow-2xl ${color}`}
    >
      <div className="grid gap-4 lg:grid-cols-[240px_1fr_180px] lg:items-center">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl border border-current/30 bg-black/30 shadow-lg">
            <Icon className="h-8 w-8" />
          </div>
          <div>
            <div className="text-xs font-black tracking-[0.28em] text-white/45">DIMENSÃO {dim.n}</div>
            <h2 className="mt-1 text-xl font-black uppercase tracking-[0.08em] text-white">{dim.title}</h2>
            <p className="mt-1 text-sm italic text-white/65">{dim.subtitle}</p>
            <div className="mt-2 inline-flex rounded-full border border-current/30 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em]">
              {dim.unit}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-end justify-between gap-3">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.22em] text-white/55">{dim.action}</div>
              <div className="mt-1 text-lg font-black uppercase tracking-[0.14em] text-white">{current}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-white">{value}</div>
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">de 13</div>
            </div>
          </div>

          <div className="h-3 rounded-full bg-gradient-to-r from-cyan-400 via-lime-300 via-yellow-300 to-orange-500 shadow-inner" />

          <input
            aria-label={dim.title}
            className="mt-3 h-7 w-full accent-yellow-300"
            type="range"
            min="1"
            max="13"
            step="1"
            value={value}
            onChange={(e) => onChange(dim.id, Number(e.target.value))}
          />

          <div className="mt-2 grid grid-cols-13 gap-1 text-center text-[10px] font-bold text-white/45">
            {Array.from({ length: 13 }, (_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-white/45">Estado</div>
          <div className="mt-2 text-lg font-black uppercase tracking-[0.08em] text-white">{f.nome}</div>
          <p className="mt-2 text-sm italic text-white/65">{f.descricao}</p>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-white/45">{compromisso[value - 1]}</p>
        </div>
      </div>
    </motion.article>
  );
}

export default function Prisma13App() {
  const [values, setValues] = useState(() =>
    Object.fromEntries(dimensions.map((d) => [d.id, d.id === "mental" ? 6 : 5]))
  );

  const media = useMemo(() => {
    const total = Object.values(values).reduce((sum, n) => sum + n, 0);
    return total / dimensions.length;
  }, [values]);

  const perfil = faixa(media);

  const reset = () => {
    setValues(Object.fromEntries(dimensions.map((d) => [d.id, 5])));
  };

  const update = (id, value) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,213,0,0.14),transparent_32%),radial-gradient(circle_at_10%_10%,rgba(34,211,238,0.10),transparent_26%),radial-gradient(circle_at_90%_10%,rgba(168,85,247,0.10),transparent_22%)]" />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <header className="mb-8 grid gap-5 lg:grid-cols-[1fr_280px] lg:items-end">
          <section>
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-yellow-300/25 bg-white/[0.04] px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-yellow-200">
              <Sparkles className="h-4 w-4" /> PRISMA13 · App Saúde e Bem-Estar
            </div>
            <h1 className="text-4xl font-black uppercase tracking-[0.15em] md:text-6xl">
              Vitalidade <span className="text-yellow-300">Integrada</span>
            </h1>
            <p className="mt-4 max-w-3xl text-lg italic leading-relaxed text-white/72">
              O corpo informa, a mente interpreta, o lugar modula e o sono regenera. Sintonize seus 13 eixos e acompanhe seu compromisso diário com vida longa e vigor juvenil.
            </p>
          </section>

          <aside className="rounded-3xl border border-yellow-300/25 bg-white/[0.04] p-5 shadow-2xl shadow-yellow-300/10">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-white/45">Perfil atual</div>
            <div className="mt-2 text-5xl font-black text-yellow-300">{media.toFixed(1)}</div>
            <div className="mt-1 text-sm font-bold uppercase tracking-[0.18em] text-white/45">média / 13</div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-3">
              <div className="text-lg font-black uppercase tracking-[0.12em]">{perfil.nome}</div>
              <p className="mt-1 text-sm italic text-white/60">{perfil.descricao}</p>
            </div>
          </aside>
        </header>

        <section className="mb-5 grid gap-3 rounded-3xl border border-white/10 bg-white/[0.035] p-4 md:grid-cols-4">
          <div className="rounded-2xl bg-black/25 p-4">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">1–4</div>
            <div className="mt-1 font-bold text-white">Retração</div>
            <p className="text-sm text-white/55">cuidado inicial</p>
          </div>
          <div className="rounded-2xl bg-black/25 p-4">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-lime-200">5–8</div>
            <div className="mt-1 font-bold text-white">Funcional</div>
            <p className="text-sm text-white/55">ritmo em reorganização</p>
          </div>
          <div className="rounded-2xl bg-black/25 p-4">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-yellow-200">9–13</div>
            <div className="mt-1 font-bold text-white">Expansão</div>
            <p className="text-sm text-white/55">vitalidade integrada</p>
          </div>
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 rounded-2xl border border-yellow-300/30 bg-yellow-300/10 px-4 py-4 text-sm font-black uppercase tracking-[0.18em] text-yellow-200 transition hover:bg-yellow-300/15"
          >
            <RotateCcw className="h-4 w-4" /> Reiniciar
          </button>
        </section>

        <section className="grid gap-4">
          {dimensions.map((dim) => (
            <DimensionCard key={dim.id} dim={dim} value={values[dim.id]} onChange={update} />
          ))}
        </section>

        <footer className="mt-8 rounded-3xl border border-yellow-300/20 bg-white/[0.035] p-5 text-center">
          <button className="inline-flex items-center gap-3 rounded-2xl border border-yellow-300/50 px-8 py-4 text-lg font-black uppercase tracking-[0.24em] text-yellow-200 transition hover:bg-yellow-300/10">
            Sincronizar Ritmos <ChevronRight className="h-5 w-5" />
          </button>
          <p className="mx-auto mt-4 max-w-3xl text-sm italic leading-relaxed text-white/60">
            Protótipo educativo de saúde e bem-estar. Não substitui avaliação médica, psicológica, nutricional ou acompanhamento profissional.
          </p>
        </footer>
      </main>
    </div>
  );
}
