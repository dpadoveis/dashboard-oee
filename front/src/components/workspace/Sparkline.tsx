import { useId, useMemo } from 'react';

interface SparklineProps {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}

export function Sparkline({ data, color, width = 220, height = 26 }: SparklineProps) {
  const rawId = useId();
  const gid = `g_${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const { d, area, last } = useMemo(() => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = Math.max(1, max - min);
    const pts = data.map((v, i) => {
      const x = (i / (data.length - 1)) * (width - 4) + 2;
      const y = height - 3 - ((v - min) / range) * (height - 8);
      return [x, y] as const;
    });
    const path = pts.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(' ');
    const areaPath = `${path} L${pts[pts.length - 1][0]},${height} L${pts[0][0]},${height} Z`;
    return { d: path, area: areaPath, last: pts[pts.length - 1] };
  }, [data, width, height]);

  return (
    <svg className="spark" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.4" fill={color} />
      <circle cx={last[0]} cy={last[1]} r="5" fill={color} opacity="0.22" />
    </svg>
  );
}
