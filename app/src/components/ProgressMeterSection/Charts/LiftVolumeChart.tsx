import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const liftVolumeData = [
  { week: 'Week 1', Bench: 4500, Squat: 5500, Deadlift: 6000 },
  { week: 'Week 2', Bench: 4700, Squat: 5800, Deadlift: 6200 },
  { week: 'Week 3', Bench: 4800, Squat: 6000, Deadlift: 6300 },
  { week: 'Week 4', Bench: 5000, Squat: 6100, Deadlift: 6400 },
];

export const LiftVolumeChart = () => {
  const liftType = 'Bench';

  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={liftVolumeData}
          margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
          <XAxis
            dataKey="week"
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            unit=" lbs"
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
            itemStyle={{ color: '#22c55e' }}
          />
          <Bar
            dataKey={liftType}
            fill="#22c55e" // Tailwind green-500
            radius={[6, 6, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
