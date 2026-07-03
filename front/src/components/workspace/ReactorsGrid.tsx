import type { OeeSummary } from "../../features/oee/types/oee";
import { ReactorCard } from "./ReactorCard";

function fmt(v: number): [string, string] {
  const s = (v * 100).toFixed(1);
  const parts = s.split(".");
  return [parts[0], parts[1] ?? "0"];
}

interface ReactorsGridProps {
  summary: OeeSummary;
}

export function ReactorsGrid({ summary }: ReactorsGridProps) {
  const R1 = summary?.reatores?.R1;
  const R2 = summary?.reatores?.R2;

  const [oeeR1Int] = R1 ? fmt(R1.oee_medio) : ["—", "0"];
  const [dispR1Int, dispR1Dec] = R1
    ? fmt(R1.disponibilidade_media)
    : ["0", "0"];
  const [perfR1Int, perfR1Dec] = R1 ? fmt(R1.performance_media) : ["0", "0"];

  const [oeeR2Int] = R2 ? fmt(R2.oee_medio) : ["—", "0"];
  const [dispR2Int, dispR2Dec] = R2
    ? fmt(R2.disponibilidade_media)
    : ["0", "0"];
  const [perfR2Int, perfR2Dec] = R2 ? fmt(R2.performance_media) : ["0", "0"];

  const dispR1Fill = R1 ? Math.min(R1.disponibilidade_media * 100, 100) : 0;
  const perfR1Fill = R1 ? Math.min(R1.performance_media * 100, 100) : 0;
  const dispR2Fill = R2 ? Math.min(R2.disponibilidade_media * 100, 100) : 0;
  const perfR2Fill = R2 ? Math.min(R2.performance_media * 100, 100) : 0;

  return (
    <div className="reactors-grid reveal">
      <ReactorCard
        id="R1"
        name="Reator 1"
        accentColor="var(--lime)"
        oeeInt={oeeR1Int}
        oeePct="%"
        availability={{
          intPart: dispR1Int,
          decPart: dispR1Dec,
          fillPct: dispR1Fill,
        }}
        performance={{
          intPart: perfR1Int,
          decPart: perfR1Dec,
          fillPct: perfR1Fill,
        }}
        performanceColor="var(--lime)"
        quality={{ intPart: "100", decPart: "0", fillPct: 100 }}
      />
      <ReactorCard
        id="R2"
        name="Reator 2"
        accentColor="var(--rust)"
        oeeInt={oeeR2Int}
        oeePct="%"
        availability={{
          intPart: dispR2Int,
          decPart: dispR2Dec,
          fillPct: dispR2Fill,
        }}
        performance={{
          intPart: perfR2Int,
          decPart: perfR2Dec,
          fillPct: perfR2Fill,
        }}
        performanceColor="var(--rust)"
        quality={{ intPart: "100", decPart: "0", fillPct: 100 }}
      />
    </div>
  );
}
