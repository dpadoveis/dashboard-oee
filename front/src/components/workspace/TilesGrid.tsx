import { BagIcon, ClockIcon, ScalesIcon, StopIcon } from "../common/icons";
import type { OeeSummary } from "../../features/oee/types/oee";
import type { ProductionStats } from "../../features/production/types/production";
import { Tile } from "./Tile";

interface TilesGridProps {
  summary: OeeSummary;
  prodStats: ProductionStats;
}

function minToHM(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}min`;
}

export function TilesGrid({ summary, prodStats }: TilesGridProps) {
  const R1 = summary?.reatores?.R1;
  const R2 = summary?.reatores?.R2;

  const opR1 = R1?.total_operacao_min ?? 0;
  const opR2 = R2?.total_operacao_min ?? 0;
  const totalOp = opR1 + opR2;

  const paradaR1 = R1?.total_paradas_min ?? 0;
  const paradaR2 = R2?.total_paradas_min ?? 0;
  const totalParada = paradaR1 + paradaR2;

  const totalBags = prodStats?.total_bags ?? 0;
  const totalKg = prodStats?.total_kg ?? 0;
  const totalTon = (totalKg / 1000).toFixed(1);

  const kgR1 = R1?.producao_total_kg ?? 0;
  const kgR2 = R2?.producao_total_kg ?? 0;

  return (
    <div className="tiles-grid reveal">
      <Tile
        color="var(--lime)"
        label="Tempo Total Operando"
        icon={<ClockIcon />}
        value={minToHM(totalOp)}
        unit=""
        footRows={[
          { k: "R1", v: minToHM(opR1) },
          { k: "R2", v: minToHM(opR2) },
        ]}
      />
      <Tile
        color="var(--rust)"
        label="Tempo de Paradas"
        icon={<StopIcon />}
        value={minToHM(totalParada)}
        unit=""
        footRows={[
          { k: "R1", v: minToHM(paradaR1) },
          { k: "R2", v: minToHM(paradaR2) },
        ]}
      />
      <Tile
        color="var(--amber)"
        label="Bags Produzidas"
        icon={<BagIcon />}
        value={totalBags.toLocaleString("pt-BR")}
        unit="bags"
        footRows={[
          { k: "R1", v: `${kgR1.toFixed(0)} kg` },
          { k: "R2", v: `${kgR2.toFixed(0)} kg` },
        ]}
      />
      <Tile
        color="var(--cobalt)"
        label="Produção Total"
        icon={<ScalesIcon />}
        value={totalTon}
        unit="toneladas"
        footRows={[
          { k: "R1", v: `${(kgR1 / 1000).toFixed(1)} t` },
          { k: "R2", v: `${(kgR2 / 1000).toFixed(1)} t` },
        ]}
      />
    </div>
  );
}
