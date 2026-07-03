import {
  DROP_THRESHOLD,
  LIMIAR_PARADA,
  PARADA_PLANEJADA_DIA,
  PESO_DELTA_THRESHOLD,
  QUALIDADE,
  ROLLING_WINDOW,
  TAXA_BASE_KG_POR_MIN,
  TEMPO_PLANEJADO_DIA,
  TEMP_THRESHOLD,
} from "../../config/constants.js";
import type { OeeRules } from "../../domain/entities/oee.js";

export const oeeRules: OeeRules = {
  tempThreshold: TEMP_THRESHOLD,
  pesoDeltaThreshold: PESO_DELTA_THRESHOLD,
  rollingWindow: ROLLING_WINDOW,
  taxaBaseKgPorMin: TAXA_BASE_KG_POR_MIN,
  tempoPlanejadoDia: TEMPO_PLANEJADO_DIA,
  paradaPlanejadaDia: PARADA_PLANEJADA_DIA,
  limiarParada: LIMIAR_PARADA,
  qualidade: QUALIDADE,
  bagDropThreshold: DROP_THRESHOLD,
};
