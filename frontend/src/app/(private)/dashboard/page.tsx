'use client';

import { useState } from 'react';
import StatCard from '@/components/analytics/StatCard';
import { Activity, Calendar, Eye, Plus, Users } from 'lucide-react';
import EventManagementSection from '@/components/analytics/EventManagementSection';
import RegistrationsPerEventChart from '@/components/analytics/RegistrationsPerEventChart';
import MonthlyRegistrationsChart from '@/components/analytics/MonthlyRegistrationsChart';
import { useOrganizerDashboard } from '@/hooks/useAnalytics';

export default function DashboardPage() {
  const [selectedEventForDaily, setSelectedEventForDaily] = useState('1');

  const { summary, registrationsPerEvent, monthlyData, isLoading, error } = useOrganizerDashboard();

  console.log(summary);

  if (isLoading || error) {
    return <p>Loading...</p>;
  }

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
            trend="+2 this month"
          />
          <StatCard
            title="Total Registrations"
            value={summary.totalRegistrations.toLocaleString()}
            icon={Users}
            subtitle="Across all events"
            trend="+15% from last month"
          />
          <StatCard
            title="Unique Participants"
            value={summary.uniqueParticipants.toLocaleString()}
            icon={Activity}
            subtitle="Individual attendees"
            trend="12% repeat rate"
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
              <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Create New Event
              </button>
              <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Eye className="h-4 w-4 mr-2" />
                View All Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RegistrationsPerEventChart data={registrationsPerEvent} />
          <MonthlyRegistrationsChart data={monthlyData} />
          {/*  /!*<DailyRegistrationsChart data={useDaily} eventName="Tech Conference 2024" />*!/*/}
        </div>
      </div>
    </div>
  );
}
