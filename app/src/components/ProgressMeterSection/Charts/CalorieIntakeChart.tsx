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
  { day: 'Jul 1', calories: 2200 },
  { day: 'Jul 2', calories: 2100 },
  { day: 'Jul 3', calories: 2400 },
  { day: 'Jul 4', calories: 2000 },
  { day: 'Jul 5', calories: 2300 },
];

export const CalorieIntakeChart = () => {
  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
          <XAxis
            dataKey="day"
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={['dataMin - 100', 'dataMax + 100']}
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
            itemStyle={{ color: '#ef4444' }}
          />
          <Line
            type="monotone"
            dataKey="calories"
            stroke="#ef4444" // Tailwind red-500
            strokeWidth={2.5}
            dot={{ r: 4, stroke: '#ef4444', fill: 'white', strokeWidth: 2 }}
            activeDot={{
              r: 6,
              stroke: '#ef4444',
              fill: 'white',
              strokeWidth: 3,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
