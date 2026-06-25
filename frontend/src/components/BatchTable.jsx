function BatchTable({ data }) {
  const batches = data.recentBatches || [];
  const reversed = [...batches].reverse().slice(0, 20);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700">Recent Batches</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-5 py-3 font-medium">Time</th>
              <th className="px-5 py-3 font-medium text-right">Agg (kg)</th>
              <th className="px-5 py-3 font-medium text-right">Bitumen (kg)</th>
              <th className="px-5 py-3 font-medium text-right">Total (kg)</th>
              <th className="px-5 py-3 font-medium text-right">Filler (kg)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reversed.map((b, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-5 py-2.5 text-gray-700 whitespace-nowrap">
                  {b.timestamp ? b.timestamp.slice(11, 19) : '--'}
                </td>
                <td className="px-5 py-2.5 text-right text-gray-700">
                  {(b.agg1 + b.agg2 + b.agg3 + b.agg4 + b.agg5).toFixed(1)}
                </td>
                <td className="px-5 py-2.5 text-right text-gray-700">
                  {b.bitumen.toFixed(1)}
                </td>
                <td className="px-5 py-2.5 text-right font-medium text-gray-900">
                  {b.totalWeight.toFixed(1)}
                </td>
                <td className="px-5 py-2.5 text-right text-gray-700">
                  {(b.filler1 + b.filler2).toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BatchTable;
