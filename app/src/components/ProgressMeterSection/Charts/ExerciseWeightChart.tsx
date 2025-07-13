import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const mockData = {
  Bench: [
    { day: 'Jul 1', weight: 135 },
    { day: 'Jul 5', weight: 145 },
    { day: 'Jul 10', weight: 155 },
  ],
  Squat: [
    { day: 'Jul 1', weight: 185 },
    { day: 'Jul 5', weight: 205 },
    { day: 'Jul 10', weight: 225 },
  ],
  Deadlift: [
    { day: 'Jul 1', weight: 225 },
    { day: 'Jul 5', weight: 245 },
    { day: 'Jul 10', weight: 245 },
  ],
};

export const ExerciseWeightChart = () => {
  // Default to 'Bench'
  const exercise = 'Bench';

  return (
    <div className="w-full">
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={mockData[exercise]}
            margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
            <XAxis
              dataKey="day"
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={['dataMin - 5', 'dataMax + 5']}
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              unit=" lbs"
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
              itemStyle={{ color: '#f59e0b' }}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ r: 4, stroke: '#f59e0b', fill: 'white', strokeWidth: 2 }}
              activeDot={{
                r: 6,
                stroke: '#f59e0b',
                fill: 'white',
                strokeWidth: 3,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
