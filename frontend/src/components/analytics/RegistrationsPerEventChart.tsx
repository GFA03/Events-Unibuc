import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ParticipantsPerEvent {
  eventId: string;
  eventName: string;
  uniqueParticipants: number;
}

export default function RegistrationsPerEventChart({ data }: { data: ParticipantsPerEvent[] }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Registrations per Event</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="eventName" angle={-45} textAnchor="end" height={80} fontSize={12} />
          <YAxis />
          <Tooltip
            formatter={(value) => [value, 'Registrations']}
            labelFormatter={(label) => `Event: ${label}`}
          />
          <Bar dataKey="registrationCount" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
