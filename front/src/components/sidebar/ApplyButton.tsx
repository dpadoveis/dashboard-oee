import { FilterArrowIcon } from "../common/icons";
import { useFilter } from "../../features/filters/FilterContext";
import { useToast } from "../../shared/contexts/ToastContext";

export function ApplyButton() {
  const { apply } = useFilter();
  const { show } = useToast();

  function handleApply() {
    apply();
    show("Filtros aplicados");
  }

  return (
    <button className="apply-btn" onClick={handleApply}>
      <FilterArrowIcon />
      Aplicar Filtros
    </button>
  );
}
