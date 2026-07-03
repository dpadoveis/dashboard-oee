import type { CSSProperties } from "react";
import type { OeeSummary } from "../../features/oee/types/oee";
import { Sparkline } from "./Sparkline";

interface PillarProps {
  color: string;
  label: string;
  intPart: string;
  decPart: string;
  spark: number[];
}

function Pillar({ color, label, intPart, decPart, spark }: PillarProps) {
  return (
    <div
      className="pillar"
      style={{ ["--clr" as string]: color } as CSSProperties}
    >
      <div className="head">
        <span className="l">
          <span className="ic"></span>
          {label}
        </span>
      </div>
      <div className="v">
        {intPart}
        <span style={{ opacity: 0.6, fontSize: "30px" }}>,</span>
        {decPart}
        <span className="pct">%</span>
      </div>
      <Sparkline data={spark} color={color} />
    </div>
  );
}

function split(v: number): [string, string] {
  const pct = (v * 100).toFixed(1);
  const [int, dec] = pct.split(".");
  return [int, dec ?? "0"];
}

interface PlantOEECardProps {
  summary: OeeSummary;
}

export function PlantOEECard({ summary }: PlantOEECardProps) {
  const R1 = summary?.reatores?.R1;
  const R2 = summary?.reatores?.R2;

  const oeeGlobal =
    R1 && R2 ? (((R1.oee_medio + R2.oee_medio) / 2) * 100).toFixed(0) : "—";

  const dispMedia =
    R1 && R2 ? (R1.disponibilidade_media + R2.disponibilidade_media) / 2 : 0;
  const perfMedia =
    R1 && R2 ? (R1.performance_media + R2.performance_media) / 2 : 0;

  const [dInt, dDec] = split(dispMedia);
  const [pInt, pDec] = split(perfMedia);

  return (
    <div className="card plant-oee reveal">
      <span className="corner-tl"></span>
      <span className="corner-tr"></span>

      <div className="card-head">
        <div className="title">
          <span className="num">A</span>
          <span>Indicadores Globais — Planta 1</span>
        </div>
      </div>

      <div className="body">
        <div className="gauge-wrap">
          <div className="gauge-cap">
            <div className="l">OEE Global</div>
            <div className="gauge-num">
              {oeeGlobal}
              <span className="pct">%</span>
            </div>
            <div className="sub">2 reatores monitorados</div>
          </div>
        </div>

        <div className="pillars">
          <Pillar
            color="var(--avail)"
            label="Disponibilidade"
            intPart={dInt}
            decPart={dDec}
            spark={[62, 58, 55, 60, 52, 48, 50, 55, 53, 49, 51, 48, 50, 51]}
          />
          <Pillar
            color="var(--perf)"
            label="Performance"
            intPart={pInt}
            decPart={pDec}
            spark={[31, 28, 34, 30, 27, 29, 33, 36, 32, 29, 27, 28, 30, 29]}
          />
          <Pillar
            color="var(--qual)"
            label="Qualidade"
            intPart="100"
            decPart="0"
            spark={[
              100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
              100,
            ]}
          />
        </div>
      </div>
    </div>
  );
}
