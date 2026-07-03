import type { DashboardData } from "../../features/oee/types/dashboard";
import { buildReactorsFromDaily } from "../../features/oee/mappers/buildReactorsFromDaily";
import { GanttCard } from "./GanttCard";
import { PlantOEECard } from "./PlantOEECard";
import { ReactorsGrid } from "./ReactorsGrid";
import { TilesGrid } from "./TilesGrid";
import { TopBar } from "./TopBar";

interface WorkspaceProps {
  apiData: DashboardData;
}

export function Workspace({ apiData }: WorkspaceProps) {
  const ganttReactors = buildReactorsFromDaily(apiData.daily);

  return (
    <main className="workspace">
      <TopBar />
      <PlantOEECard summary={apiData.summary} />
      <ReactorsGrid summary={apiData.summary} />
      <GanttCard reactors={ganttReactors} />
      <TilesGrid summary={apiData.summary} prodStats={apiData.prodStats} />
    </main>
  );
}
