'use client';

import { useParams } from 'next/navigation';
import { useEvent } from '@/hooks/events/useEvent';
import WithLoader from '@/components/common/WithLoader';
import { useState } from 'react';
import CreateEventModal from '@/components/events/CreateEventModal';
import EventHeader from '@/app/(public)/events/[id]/(components)/EventHeader';
import EventDetails from '@/app/(public)/events/[id]/(components)/EventDetails';

export default function EventDetailsPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: event, isLoading, isError } = useEvent(id);

  if (!event) return <p>Event not found.</p>;

  return (
    <>
      <WithLoader isLoading={isLoading} isError={isError} errorMessage={'Failed to load event'}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <EventHeader setIsEditModalOpen={setIsEditModalOpen} />
          <EventDetails />
        </div>
      </WithLoader>

      <CreateEventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        event={event}
        mode="edit"
      />
    </>
  );
}
