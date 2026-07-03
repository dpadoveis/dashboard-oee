import type { GanttSegment, Reactor } from "../../../shared/types/ui";
import type { OeeDaily, ReactorId } from "../types/oee";

const MINUTES_PER_DAY = 1440;

const REACTOR_META: Array<{ id: ReactorId; name: string; clr: string }> = [
  { id: "R1", name: "REATOR 1", clr: "var(--lime)" },
  { id: "R2", name: "REATOR 2", clr: "var(--rust)" },
];

export function buildReactorsFromDaily(daily: OeeDaily[]): Reactor[] {
  return REACTOR_META.map(({ id, name, clr }) => {
    const gantt = daily
      .filter((day) => day[id] != null)
      .map((day) => {
        const operationMinutes = Number(
          day[id]?.tempo_operacao_efetiva ?? 0,
        );
        const idleMinutes = Math.max(0, MINUTES_PER_DAY - operationMinutes);
        const segs: GanttSegment[] = [
          ["prod", operationMinutes],
          ["idle", idleMinutes],
        ];

        return {
          d: String(day.data).slice(8, 10),
          fullDate: String(day.data),
          segs,
        };
      });

    const productionMinutes = gantt.reduce(
      (total, day) =>
        total +
        day.segs
          .filter(([code]) => code === "prod")
          .reduce((sum, [, minutes]) => sum + minutes, 0),
      0,
    );

    return {
      id,
      name,
      clr,
      uptime: {
        h: Math.floor(productionMinutes / 60),
        m: productionMinutes % 60,
      },
      gantt,
    };
  });
}
