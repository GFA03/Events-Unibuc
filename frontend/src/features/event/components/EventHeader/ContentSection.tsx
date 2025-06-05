import React, { Dispatch } from 'react';
import { useEventDetails } from '@/features/event/hooks/useEventDetails';
import Link from 'next/link';
import ManagementButtons from './ManagementButtons';
import EventStats from '@/features/event/components/EventHeader/EventStats';
import EventDateTime from '@/features/event/components/EventHeader/EventDateTime';
import ActionButtons from '@/features/event/components/EventHeader/ActionButtons';

export default function ContentSection({
  setIsEditModalOpen
}: {
  setIsEditModalOpen: Dispatch<React.SetStateAction<boolean>>;
}) {
  const { event, isRegistered, canManageEvent, handleUnjoin, handleDelete, handleJoin } =
    useEventDetails();

  if (!event) {
    return <p className="text-red-500">Event not found!</p>;
  }

  const { name, type, organizer, noParticipants, startDateTime, endDateTime } = event;

  if (!organizer) {
    return <p className="text-red-500">Organizer not found!</p>;
  }

  return (
    <div className="lg:w-1/2 p-8 lg:p-12">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-full capitalize shadow-lg">
            {type}
          </span>
        </div>

        <ManagementButtons
          handleDelete={handleDelete}
          setIsEditModalOpen={setIsEditModalOpen}
          canManageEvent={canManageEvent}
        />
      </div>

      <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
        {name}
      </h1>

      <p className="text-gray-600 mb-6 flex items-center gap-2">
        <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
        Organized by:{' '}
        <Link href={`/user/${organizer.id}`} className="hover:underline">
          {organizer.firstName} {organizer.lastName}
        </Link>
      </p>

      <EventStats noParticipants={noParticipants} startDateTime={startDateTime} />

      <EventDateTime startDateTime={startDateTime} endDateTime={endDateTime} />

      <ActionButtons
        isRegistered={isRegistered}
        handleJoin={handleJoin}
        handleUnjoin={handleUnjoin}
        event={event}
      />
    </div>
  );
}
