import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { DailyRegistrations } from '@/features/analytics/types/DailyRegistrations';

export default function DailyRegistrationsChart({
  data,
  eventName = 'Selected Event'
}: {
  data: DailyRegistrations[];
  eventName?: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Daily Registrations</h3>
      <p className="text-sm text-gray-600 mb-4">{eventName}</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) =>
              new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }
          />
          <YAxis />
          <Tooltip
            formatter={(value) => [value, 'Registrations']}
            labelFormatter={(date) => `Date: ${new Date(date).toLocaleDateString()}`}
          />
          <Line
            type="monotone"
            dataKey="registrationCount"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
