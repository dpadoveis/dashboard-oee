import type {
  ClassifiedTelemetryMinute,
  OperationalState,
  OeeRules,
  RawTelemetryMinute,
} from "../entities/oee.js";

export class TelemetryClassifier {
  constructor(private readonly rules: OeeRules) {}

  classify(date: string, rows: RawTelemetryMinute[]): ClassifiedTelemetryMinute[] {
    const dayGrid = buildDayGrid(date);
    const merged = mergeGrid(dayGrid, rows);
    forwardFillSiloWeight(merged);

    const temps = merged.map((row) => row.temp ?? 0);
    const silos = merged.map((row) => row.silo_weight ?? 0);
    const deltas = diff(silos);
    const productionDeltas = deltas.map((delta) =>
      delta < this.rules.bagDropThreshold ? 0 : delta,
    );
    const rollingDeltas = rollingMean(
      productionDeltas,
      this.rules.rollingWindow,
    );

    return merged.map((row, index) => {
      const temp = temps[index];
      const temp_ok = temp >= this.rules.tempThreshold ? 1 : 0;
      const prod_ok =
        rollingDeltas[index] > this.rules.pesoDeltaThreshold ? 1 : 0;
      const estado = classifyState(temp_ok, prod_ok);

      return {
        timestamp: row.timestamp,
        temp,
        delta_peso: deltas[index],
        temp_ok,
        prod_ok,
        estado,
      };
    });
  }
}

function classifyState(tempOk: 0 | 1, prodOk: 0 | 1): OperationalState {
  if (tempOk === 1 && prodOk === 1) return "P";
  if (tempOk === 1 && prodOk === 0) return "A";
  if (tempOk === 0 && prodOk === 1) return "I";
  return "O";
}

function buildDayGrid(date: string): string[] {
  return Array.from(
    { length: 1440 },
    (_, index) =>
      `${date} ${String(Math.floor(index / 60)).padStart(2, "0")}:${String(index % 60).padStart(2, "0")}:00`,
  );
}

function mergeGrid(
  grid: string[],
  rows: RawTelemetryMinute[],
): RawTelemetryMinute[] {
  const byTimestamp = new Map(
    rows.map((row) => [row.timestamp.slice(0, 19).replace("T", " "), row]),
  );

  return grid.map((timestamp) => {
    const row = byTimestamp.get(timestamp);
    return {
      timestamp,
      temp: row?.temp ?? null,
      silo_weight: row?.silo_weight ?? null,
    };
  });
}

function forwardFillSiloWeight(rows: RawTelemetryMinute[]): void {
  let last: number | null = null;
  for (const row of rows) {
    if (row.silo_weight !== null) last = row.silo_weight;
    else if (last !== null) row.silo_weight = last;
  }
}

function diff(values: number[]): number[] {
  return values.map((value, index) => (index === 0 ? 0 : value - values[index - 1]));
}

function rollingMean(values: number[], window: number): number[] {
  return values.map((_, index) => {
    const start = Math.max(0, index - window + 1);
    const slice = values.slice(start, index + 1);
    return slice.reduce((sum, value) => sum + value, 0) / slice.length;
  });
}
