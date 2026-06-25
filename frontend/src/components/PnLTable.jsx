function toPct(v) {
  return (v * 100).toFixed(1);
}

function format(v) {
  if (Math.abs(v) >= 1e6) return (v / 1e6).toFixed(1) + 'M';
  if (Math.abs(v) >= 1e3) return (v / 1e3).toFixed(1) + 'K';
  return v.toFixed(1);
}

function PnLTable({ rows }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700">
          All Plants — P&L (31st May)
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50">
              <th className="px-4 py-3 font-medium">Plant</th>
              <th className="px-4 py-3 font-medium text-right">Sales Qty</th>
              <th className="px-4 py-3 font-medium text-right">Revenue</th>
              <th className="px-4 py-3 font-medium text-right">GP</th>
              <th className="px-4 py-3 font-medium text-right">GP%</th>
              <th className="px-4 py-3 font-medium text-right">NP</th>
              <th className="px-4 py-3 font-medium text-right">NP%</th>
              <th className="px-4 py-3 font-medium text-right">vs Plan NP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r, i) => {
              if (!r.plantName) return null;
              const npVar = r.npActual31 - r.npPlan31;
              return (
                <tr
                  key={i}
                  className={`hover:bg-gray-50 ${r.isSectorTotal || r.plantName.includes('Total') ? 'font-semibold bg-gray-50' : ''}`}
                >
                  <td className="px-4 py-2.5 text-gray-900 whitespace-nowrap">
                    {r.plantName}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-700">
                    {format(r.salesQtyActual31 || 0)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-700">
                    {format(r.revenueActual31 || 0)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-700">
                    {format(r.gpActual31 || 0)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-700">
                    {toPct(r.gpPctActual31 || 0)}%
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium text-gray-900">
                    {format(r.npActual31 || 0)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-700">
                    {toPct(r.npPctActual31 || 0)}%
                  </td>
                  <td className={`px-4 py-2.5 text-right font-medium ${npVar >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {npVar >= 0 ? '+' : ''}{format(npVar)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PnLTable;
