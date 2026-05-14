import { buildHealthSnapshot } from "@prisma13/core";
import { useAuth } from "./auth/useAuth";
import { useHealthData } from "./health/useHealthData";
import "./styles.css";

export function App() {
  const auth = useAuth();
  const health = useHealthData({
    getIdToken: auth.getIdToken,
    enabled: Boolean(auth.user),
  });
  const snapshot = buildHealthSnapshot({
    manualScores: health.data?.profile?.scores || {},
    wearableSummary: health.data?.wearables?.googleFit?.summary || {},
  });

  return (
    <main className="app-shell">
      <section className="panel">
        <p className="eyebrow">PRISMA13</p>
        <h1>Vitalidade integrada</h1>
        {auth.loading && <p>Preparando ingresso seguro.</p>}
        {!auth.loading && !auth.user && <p>Entre para sincronizar seus sinais reais.</p>}
        {auth.user && health.loading && <p>Lendo seus dados protegidos.</p>}
        {auth.user && health.error && <p role="alert">{health.error.message}</p>}
        {auth.user && health.data && (
          <p>
            Media atual: <strong>{snapshot.average || "sem leitura"}</strong>
          </p>
        )}
      </section>
    </main>
  );
}
