import type { LegendItem } from '../../shared/types/ui';

interface LegendListProps {
  items: LegendItem[];
}

export function LegendList({ items }: LegendListProps) {
  return (
    <div className="legend">
      {items.map((l) => (
        <div className="legend-row" key={l.code}>
          <span
            className="sq"
            style={{
              background: l.color,
              boxShadow: `0 0 0 1px ${l.color}40, 0 0 8px ${l.color}40`,
            }}
          ></span>
          <span>{l.label}</span>
        </div>
      ))}
    </div>
  );
}
