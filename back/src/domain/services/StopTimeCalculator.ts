import type { ClassifiedTelemetryMinute, OeeRules } from "../entities/oee.js";

export class StopTimeCalculator {
  constructor(private readonly rules: OeeRules) {}

  calculate(classified: ClassifiedTelemetryMinute[]): {
    tempo_operacao_efetiva: number;
    tempo_parada_nao_plan: number;
  } {
    const tempo_operacao_efetiva = classified.filter(
      (minute) => minute.estado === "P",
    ).length;
    const afterPlannedStop = classified.filter(
      (_, index) => index >= this.rules.paradaPlanejadaDia,
    );
    const tempo_parada_nao_plan = detectBlocks(afterPlannedStop)
      .filter(
        (block) =>
          block.estado !== "P" && block.length >= this.rules.limiarParada,
      )
      .reduce((sum, block) => sum + block.length, 0);

    return { tempo_operacao_efetiva, tempo_parada_nao_plan };
  }
}

function detectBlocks(
  minutes: ClassifiedTelemetryMinute[],
): { estado: string; length: number }[] {
  if (!minutes.length) return [];

  const effectiveState = (minute: ClassifiedTelemetryMinute) =>
    minute.estado === "I" ? "O" : minute.estado;
  const blocks: { estado: string; length: number }[] = [];
  let current = effectiveState(minutes[0]);
  let count = 1;

  for (let index = 1; index < minutes.length; index++) {
    const state = effectiveState(minutes[index]);
    if (state === current) {
      count++;
    } else {
      blocks.push({ estado: current, length: count });
      current = state;
      count = 1;
    }
  }

  blocks.push({ estado: current, length: count });
  return blocks;
}
