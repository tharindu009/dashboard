function KpiCards({ data }) {
  const lb = data.latestBatch || {};

  const cards = [
    {
      label: 'Latest Batch',
      value: lb.timestamp || '--',
      sub: `Batch #${data.batchCount}`,
      color: 'blue',
    },
    {
      label: 'Total Weight',
      value: `${(lb.totalWeight || 0).toFixed(1)} kg`,
      sub: `${data.todaysBatchCount || 0} batches today`,
      color: 'green',
    },
    {
      label: 'Today\'s Total',
      value: `${(data.todaysTotalWeight || 0).toFixed(1)} kg`,
      sub: `${((data.todaysTotalWeight || 0) / 1000).toFixed(2)} tonnes`,
      color: 'indigo',
    },
    {
      label: 'Bitumen',
      value: `${(lb.bitumen || 0).toFixed(1)} kg`,
      sub: `Per batch`,
      color: 'amber',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-gray-500 mb-1">{card.label}</p>
          <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}

export default KpiCards;
