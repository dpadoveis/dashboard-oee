import type { CSSProperties, ReactNode } from 'react';

interface MetricRowProps {
  metricColor: string;
  label: string;
  intPart: string;
  decPart: string;
  fillPct: number;
  over?: boolean;
  alert?: ReactNode;
}

function MetricRow({ metricColor, label, intPart, decPart, fillPct, over, alert }: MetricRowProps) {
  return (
    <div className="rm-row" style={{ ['--mclr' as string]: metricColor } as CSSProperties}>
      <span className="l">
        <span className="ic"></span>
        {label}
      </span>
      <span className="v">
        {intPart}
        <span className="pct">,{decPart}%</span>
      </span>
      <span className="bar">
        <span className={`fill${over ? ' over' : ''}`} style={{ width: `${fillPct}%` }}></span>
      </span>
      <span className="ovr">{alert}</span>
    </div>
  );
}

export interface ReactorCardProps {
  id: string;
  name: string;
  accentColor: string;
  oeeInt: string;
  oeePct: string;
  availability: { intPart: string; decPart: string; fillPct: number; over?: boolean; alert?: ReactNode };
  performance: { intPart: string; decPart: string; fillPct: number };
  performanceColor: string;
  quality: { intPart: string; decPart: string; fillPct: number };
}

export function ReactorCard({
  id,
  name,
  accentColor,
  oeeInt,
  oeePct,
  availability,
  performance,
  performanceColor,
  quality,
}: ReactorCardProps) {
  const cssVars: CSSProperties = {
    ['--clr' as string]: accentColor,
    ['--st-clr' as string]: accentColor,
  } as CSSProperties;

  return (
    <div className="reactor" style={cssVars}>
      <div className="reactor-head">
        <div className="left">
          <div className="id">{id}</div>
          <div className="name-block">
            <div className="name">{name}</div>
          </div>
        </div>
      </div>

      <div className="reactor-body">
        <div className="reactor-gauge">
          <div>
            <div className="num">
              {oeeInt}
              <span className="pct">{oeePct}</span>
            </div>
            <div className="lbl">OEE</div>
          </div>
        </div>

        <div className="reactor-metrics">
          <MetricRow
            metricColor="var(--avail)"
            label="Disponibilidade"
            intPart={availability.intPart}
            decPart={availability.decPart}
            fillPct={availability.fillPct}
            over={availability.over}
            alert={availability.alert}
          />
          <MetricRow
            metricColor={performanceColor}
            label="Performance"
            intPart={performance.intPart}
            decPart={performance.decPart}
            fillPct={performance.fillPct}
          />
          <MetricRow
            metricColor="var(--qual)"
            label="Qualidade"
            intPart={quality.intPart}
            decPart={quality.decPart}
            fillPct={quality.fillPct}
          />
        </div>
      </div>
    </div>
  );
}
