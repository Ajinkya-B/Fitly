import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const data = [
  { date: 'Jul 1', weight: 172 },
  { date: 'Jul 5', weight: 170.5 },
  { date: 'Jul 10', weight: 169.8 },
  { date: 'Jul 15', weight: 168.2 },
  { date: 'Jul 20', weight: 167.4 },
];

export const WeightChart = () => {
  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={['dataMin - 1', 'dataMax + 1']}
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              borderColor: '#e5e7eb',
              borderRadius: 8,
              fontSize: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
            labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
            itemStyle={{ color: '#3b82f6' }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#3b82f6" // Tailwind blue-500
            strokeWidth={2.5}
            dot={{ r: 4, stroke: '#3b82f6', fill: 'white', strokeWidth: 2 }}
            activeDot={{
              r: 6,
              stroke: '#3b82f6',
              fill: 'white',
              strokeWidth: 3,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
