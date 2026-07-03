import { useState } from 'react';
import { ExportIcon } from '../common/icons';
import { useToast } from '../../shared/contexts/ToastContext';
import { useFilter } from '../../features/filters/FilterContext';
import { exportXlsx } from '../../shared/services/exportXlsx';

export function TopBar() {
  const { show } = useToast();
  const { applied } = useFilter();
  const [busy, setBusy] = useState(false);

  async function handleExport() {
    if (busy) return;
    setBusy(true);
    try {
      show('Gerando XLSX…');
      await exportXlsx(applied.startDate, applied.endDate);
      show('Exportação concluída');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao exportar';
      show(`Falha: ${msg}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="topbar reveal">
      <div>
        <h1>
          Indicadores · <span className="accent">PLANTA 1</span>
        </h1>
      </div>
      <div className="topbar-right">
        <button
          className="export-btn"
          onClick={handleExport}
          disabled={busy}
        >
          <ExportIcon />
          {busy ? 'Exportando…' : 'Exportar'}
        </button>
      </div>
    </div>
  );
}
