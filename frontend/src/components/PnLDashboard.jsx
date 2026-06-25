import useStore from '../store';
import PnLKpiCards from './PnLKpiCards';
import PnLTable from './PnLTable';
import PnLChart from './PnLChart';

function PnLDashboard() {
  const pnlData = useStore((s) => s.pnlData);

  if (!pnlData || !pnlData.rows || pnlData.rows.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Waiting for P&L data...
      </div>
    );
  }

  const plantRows = pnlData.rows.filter((r) => !r.isSectorTotal && r.plantName);
  const sectorRows = pnlData.rows.filter((r) => r.isSectorTotal);

  return (
    <div className="space-y-6">
      <PnLKpiCards rows={pnlData.rows} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PnLChart rows={plantRows} />
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Period</h2>
          <p className="text-lg font-medium text-gray-900">{pnlData.reportTitle || 'May 2026'}</p>
          <p className="text-xs text-gray-400 mt-1">
            Last updated: {new Date(pnlData.lastUpdated).toLocaleTimeString()}
          </p>
        </div>
      </div>
      <PnLTable rows={pnlData.rows} />
    </div>
  );
}

export default PnLDashboard;
