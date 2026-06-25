function toPct(v) {
  return (v * 100).toFixed(1);
}

function format(v) {
  if (Math.abs(v) >= 1e6) return (v / 1e6).toFixed(1) + 'M';
  if (Math.abs(v) >= 1e3) return (v / 1e3).toFixed(1) + 'K';
  return v.toFixed(1);
}

function PnLKpiCards({ rows }) {
  const plants = rows.filter((r) => !r.isSectorTotal);
  const totals = rows.filter((r) => r.plantName.includes('Total'));
  const asphaltSector = rows.find((r) => r.plantName.includes('Asphalt Sector'));

  const t = asphaltSector || totals[0] || {};

  const cards = [
    {
      label: 'Revenue (31st)',
      value: format(t.revenueActual31 || 0),
      plan: format(t.revenuePlan31 || 0),
      label2: 'Plan',
      color: 'blue',
    },
    {
      label: 'Gross Profit (31st)',
      value: format(t.gpActual31 || 0),
      plan: format(t.gpPlan31 || 0),
      pct: toPct(t.gpPctActual31 || 0),
      label2: `Plan ${toPct(t.gpPctPlan31 || 0)}%`,
      color: 'green',
    },
    {
      label: 'Net Profit (31st)',
      value: format(t.npActual31 || 0),
      plan: format(t.npPlan31 || 0),
      pct: toPct(t.npPctActual31 || 0),
      label2: `Plan ${toPct(t.npPctPlan31 || 0)}%`,
      color: 'indigo',
    },
    {
      label: 'Sales Qty (31st)',
      value: format(t.salesQtyActual31 || 0),
      plan: format(t.salesQtyPlan31 || 0),
      label2: 'Plan',
      color: 'amber',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">{card.label}</p>
          <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400">{card.label2}: {card.plan}</span>
            {card.pct !== undefined && (
              <span className="text-xs font-medium text-gray-600">({card.pct}%)</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PnLKpiCards;
