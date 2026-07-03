import type { CSSProperties } from 'react';
import type { GanttDay, Reactor } from '../../shared/types/ui';
import { colorByCode, labelByCode } from '../../shared/data/plantData';

const MESES = [
  'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
  'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ',
];

function minToHM(min: number): string {
  const total = Math.max(0, Math.round(min));
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}h ${m}min`;
}

function fmtDate(iso?: string, fallback?: string): string {
  if (!iso) return fallback ?? '';
  const [, mm, dd] = iso.split('-');
  const mes = MESES[Number(mm) - 1] ?? '';
  return `${dd} ${mes}`;
}

interface GanttCellProps {
  day: GanttDay;
  reactorIndex: number;
  color: string;
}

function GanttCell({ day, reactorIndex, color }: GanttCellProps) {
  return (
    <div className="gantt-cell" style={{ ['--c' as string]: color } as CSSProperties}>
      <span className="day">{day.d}</span>
      <div className="gantt-tooltip">
        <strong>
          {fmtDate(day.fullDate, day.d)} · R{reactorIndex + 1}
        </strong>
        {day.segs.map((s) => `${labelByCode(s[0])}: ${minToHM(s[1])}`).join(' · ')}
      </div>
    </div>
  );
}

function dayColor(day: GanttDay): string {
  const hasStop = day.segs.some((s) => s[0] === 'stop');
  if (hasStop) return colorByCode('stop');
  const prod = day.segs
    .filter((s) => s[0] === 'prod')
    .reduce((a, s) => a + s[1], 0);
  const idle = day.segs
    .filter((s) => s[0] === 'idle')
    .reduce((a, s) => a + s[1], 0);
  if (idle > prod) return colorByCode('stop');
  if (prod > 0) return colorByCode('prod');
  return colorByCode('idle');
}

interface GanttRowProps {
  reactor: Reactor;
  index: number;
}

function GanttRow({ reactor, index }: GanttRowProps) {
  const prodMin = reactor.gantt.reduce(
    (a, d) => a + d.segs.filter((s) => s[0] === 'prod').reduce((b, s) => b + s[1], 0),
    0
  );
  const prodH = Math.floor(prodMin / 60);
  const trackStyle = {
    ['--gantt-days' as string]: Math.max(reactor.gantt.length, 1),
  } as CSSProperties;

  return (
    <div className="gantt-row" style={{ ['--clr' as string]: reactor.clr } as CSSProperties}>
      <div className="label">
        <span className="id">{reactor.id}</span>
        {reactor.name}
      </div>
      <div className="gantt-track" style={trackStyle}>
        {reactor.gantt.map((day) => (
          <GanttCell
            key={day.fullDate ?? day.d}
            day={day}
            reactorIndex={index}
            color={dayColor(day)}
          />
        ))}
      </div>
      <div className="uptime">
        <span>{prodH}h</span>operando
      </div>
    </div>
  );
}

interface GanttCardProps {
  reactors: Reactor[];
}

export function GanttCard({ reactors }: GanttCardProps) {
  const dates = Array.from(
    new Set(
      reactors.flatMap((r) =>
        r.gantt.map((d) => d.fullDate).filter((x): x is string => !!x),
      ),
    ),
  ).sort();
  const inicio = dates[0];
  const fim = dates[dates.length - 1];

  return (
    <div className="card gantt-card reveal">
      <span className="corner-tl"></span>
      <span className="corner-tr"></span>

      <div className="card-head">
        <div className="title">
          <span className="num">B</span>
          <span>Cronograma de Operação · Período Completo</span>
        </div>
      </div>

      <div className="body">
        {reactors.map((r, i) => (
          <GanttRow key={r.id} reactor={r} index={i} />
        ))}
        <div className="gantt-axis">
          <div></div>
          <div className="scale">
            <span>{fmtDate(inicio)}</span>
            <span>{fmtDate(fim)}</span>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
