'use client';

import StatCard from '@/features/analytics/components/StatCard';
import { Activity, Calendar, Plus, Users } from 'lucide-react';
import EventManagementSection from '@/features/analytics/components/EventManagementSection';
import RegistrationsPerEventChart from '@/features/analytics/components/RegistrationsPerEventChart';
import MonthlyRegistrationsChart from '@/features/analytics/components/MonthlyRegistrationsChart';
import { useOrganizerDashboard } from '@/features/analytics/hooks';
import { useMyEvents } from '@/features/event/hooks/useMyEvents';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const { data: events, isLoading: eventsLoading, isError: eventsIsError } = useMyEvents();

  const { summary, registrationsPerEvent, monthlyData, isLoading, isError } =
    useOrganizerDashboard();

  console.log(events);
  console.log(summary);
  console.log(registrationsPerEvent);
  console.log(monthlyData);

  // isLoading and eventsLoading makes sure: summary, registrationsPerEvent, monthlyData and dailyData are all loaded before rendering
  if (!summary || isLoading || eventsLoading) {
    return <p>Loading...</p>;
  }

  if (isError || eventsIsError) {
    return <p>Error loading dashboard data</p>;
  }

  const positiveSign = (value: number) => {
    if (value > 0) {
      return '+';
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your events and track performance metrics</p>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Events"
            value={summary.totalEvents}
            icon={Calendar}
            subtitle="All time events created"
            trendValue={summary.totalEventsMonthlyTrend}
            trendText={`${positiveSign(summary.totalEventsMonthlyTrend)}${summary.totalEventsMonthlyTrend}% this month`}
          />
          <StatCard
            title="Total Registrations"
            value={summary.totalRegistrations.toLocaleString()}
            icon={Users}
            subtitle="Across all events"
            trendValue={summary.totalRegistrationsMonthlyTrend}
            trendText={`${positiveSign(summary.totalRegistrationsMonthlyTrend)}${summary.totalRegistrationsMonthlyTrend}% from last month`}
          />
          <StatCard
            title="Unique Participants"
            value={summary.uniqueParticipants.toLocaleString()}
            icon={Activity}
            subtitle="Individual attendees"
            trendValue={summary.totalUniqueParticipantsMonthlyTrend}
            trendText={`${positiveSign(summary.totalUniqueParticipantsMonthlyTrend)}${summary.totalUniqueParticipantsMonthlyTrend}% participants`}
          />
        </div>

        {/* Event Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <EventManagementSection recentEvents={summary.recentEvents} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('manage-events')}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Create New Event
              </button>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RegistrationsPerEventChart data={registrationsPerEvent!} />
          <MonthlyRegistrationsChart data={monthlyData!} />
        </div>
      </div>
    </div>
  );
}
