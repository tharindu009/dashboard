import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

function PnLChart({ rows }) {
  const chartData = rows
    .filter((r) => r.plantName && (r.revenueActual31 > 0 || r.gpActual31 !== 0))
    .map((r) => ({
      name: r.plantName.trim(),
      Revenue: r.revenueActual31,
      GP: r.gpActual31,
      NP: r.npActual31,
    }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <p className="text-sm text-gray-500">No chart data</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">
        Revenue, GP & NP by Plant (31st May)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="GP" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="NP" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PnLChart;
