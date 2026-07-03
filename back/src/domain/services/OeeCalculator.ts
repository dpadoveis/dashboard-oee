import type { DailyOeeIndicator, OeeRules, ReactorId } from "../entities/oee.js";

export class OeeCalculator {
  constructor(private readonly rules: OeeRules) {}

  calculate(input: {
    date: string;
    reator: ReactorId;
    tempo_operacao_efetiva: number;
    tempo_parada_nao_plan: number;
    producao_real: number;
  }): DailyOeeIndicator {
    const producao_ideal =
      input.tempo_operacao_efetiva > 0
        ? input.tempo_operacao_efetiva * this.rules.taxaBaseKgPorMin
        : 0;
    const performance =
      producao_ideal > 0 ? input.producao_real / producao_ideal : 0;
    const disponibilidade =
      input.tempo_operacao_efetiva / this.rules.tempoPlanejadoDia;
    const oee = disponibilidade * performance * this.rules.qualidade;

    return {
      data: input.date,
      reator: input.reator,
      tempo_operacao_efetiva: input.tempo_operacao_efetiva,
      tempo_parada_nao_plan: input.tempo_parada_nao_plan,
      producao_real: input.producao_real,
      producao_ideal,
      disponibilidade,
      performance,
      oee,
      qualidade: this.rules.qualidade,
      processed_at: new Date().toISOString().replace("T", " ").slice(0, 19),
    };
  }
}
