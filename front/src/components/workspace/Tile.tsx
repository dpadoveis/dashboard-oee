import type { CSSProperties, ReactNode } from 'react';

export interface TileFootRow {
  k: string;
  v: string;
}

interface TileProps {
  color: string;
  label: string;
  icon: ReactNode;
  value: string;
  unit: ReactNode;
  footRows: TileFootRow[];
}

export function Tile({ color, label, icon, value, unit, footRows }: TileProps) {
  return (
    <div className="tile" style={{ ['--clr' as string]: color } as CSSProperties}>
      <div className="tile-head">
        <span className="lbl">{label}</span>
        <span className="ic">{icon}</span>
      </div>
      <div className="tile-value">
        <span className="v">{value}</span>
        <span className="u">{unit}</span>
      </div>
      <div className="tile-foot">
        {footRows.map((r) => (
          <div className="ln" key={r.k}>
            <span className="k">{r.k}</span>
            <span className="vv">{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
