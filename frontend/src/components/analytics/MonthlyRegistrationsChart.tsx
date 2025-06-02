import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface MonthlyRegistrationCount {
  year: number;
  month: number;
  registrationCount: number;
}

export default function MonthlyRegistrationsChart({ data }: { data: MonthlyRegistrationCount[] }) {
  const formattedData = data.map((item) => ({
    ...item,
    monthName: new Date(item.year, item.month - 1).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    })
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Registrations Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthName" />
          <YAxis />
          <Tooltip
            formatter={(value) => [value, 'Registrations']}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="registrationCount"
            stroke="#8B5CF6"
            strokeWidth={3}
            dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
