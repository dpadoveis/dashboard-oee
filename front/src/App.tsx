import { useEffect, useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { Sidebar } from "./components/sidebar/Sidebar";
import { Workspace } from "./components/workspace/Workspace";
import { Providers } from "./app/Providers";
import { useFilter } from "./features/filters/FilterContext";
import { plantData } from "./shared/data/plantData";
import { fetchOeeDaily, fetchOeeSummary } from "./features/oee/api/oeeApi";
import { fetchProductionStats } from "./features/production/api/productionApi";
import type { DashboardData } from "./features/oee/types/dashboard";

function DashboardApp() {
  const { applied } = useFilter();
  const [apiData, setApiData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchOeeSummary(applied.startDate, applied.endDate),
      fetchOeeDaily(applied.startDate, applied.endDate),
      fetchProductionStats(applied.startDate, applied.endDate),
    ])
      .then(([summary, daily, prodStats]) =>
        setApiData({ summary, daily, prodStats }),
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [applied]);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "#a3e635",
          fontSize: "1.35rem",
          lineHeight: 1.5,
          background: "#07090f",
        }}
      >
        Carregando dados...
      </div>
    );

  if (error)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "#ef4444",
          fontSize: "1.15rem",
          lineHeight: 1.5,
          background: "#07090f",
        }}
      >
        Erro: {error}
      </div>
    );

  return (
    <AppShell>
      <Sidebar plant={plantData.name} />
      <Workspace apiData={apiData!} />
    </AppShell>
  );
}

function App() {
  return (
    <Providers>
      <DashboardApp />
    </Providers>
  );
}

export default App;
