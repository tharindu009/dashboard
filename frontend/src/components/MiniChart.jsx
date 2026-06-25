import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

function MiniChart({ data }) {
  const batches = data.recentBatches || [];
  const chartData = batches.slice(-50).map((b, i) => ({
    index: i + 1,
    time: b.timestamp ? b.timestamp.slice(11, 19) : '',
    total: b.totalWeight,
    bitumen: b.bitumen,
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <p className="text-sm text-gray-500">No chart data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">
        Batch Weight Trend (last {chartData.length} batches)
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: '1px solid #e5e7eb',
            }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
            name="Total (kg)"
          />
          <Line
            type="monotone"
            dataKey="bitumen"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
            name="Bitumen (kg)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MiniChart;
