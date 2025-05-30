'use client';

import { useEffect, useState } from 'react';
import { fetchUserRegistrationsClient } from '@/lib/registrations';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Registration } from '@/types/registration';
import EventCard from '@/components/events/EventCard';

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserRegistrationsClient()
      .then((data) => {
        setRegistrations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load registrations.');
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  const events = registrations.map((reg) => reg.event);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Registrations</h1>
      {registrations.length === 0 ? (
        <p>No registrations yet.</p>
      ) : (
        <ul className="space-y-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} viewMode="list" />
          ))}
        </ul>
      )}
    </div>
  );
}
