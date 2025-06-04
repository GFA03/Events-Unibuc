import { ArrowRight, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Event } from '@/models/event/Event';
import { Registration } from '@/features/registration/types/registration';

export default function EventManagementSection({
  recentEvents
}: {
  recentEvents: (Event & { registrations: Registration[] })[];
}) {
  const router = useRouter();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Event Management</h3>
          <p className="text-sm text-gray-600">Quick access to your recent events</p>
        </div>
        <button
          onClick={() => router.push('/manage-events')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Settings className="h-4 w-4 mr-2" />
          Manage Events
          <ArrowRight className="h-4 w-4 ml-2" />
        </button>
      </div>

      <div className="space-y-4">
        {recentEvents.map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{event.name}</h4>
              <p className="text-sm text-gray-500">
                {new Date(event.startDateTime).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {event.registrations.length} registrations
                </p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <button
          onClick={() => router.push('/manage-events')}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          View All Events
          <ArrowRight className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );
}
