import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faClock,
  faPenToSquare,
  faPerson,
  faShare,
  faTicket,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { format } from 'date-fns';
import React from 'react';
import { useEventDetails } from '@/app/(public)/events/[id]/(hooks)/useEventDetails';

export default function EventHeader() {
  const { event } = useEventDetails();
  if (!event) {
    return null;
  }

  const { name } = event;

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-lg">
          <div className="flex flex-col lg:flex-row">
            <ImageSection name={name} />
            <ContentSection />
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageSection({ name }: { name: string }) {
  return (
    <div className="lg:w-1/2 relative">
      <Image
        src="/unibuc-event-logo.png"
        alt={name}
        width={600}
        height={400}
        className="object-cover w-full h-64 lg:h-full"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
    </div>
  );
}

function ContentSection() {
  const {
    event,
    isRegistered,
    canManageEvent,
    setIsEditModalOpen,
    handleUnjoin,
    handleDelete,
    handleJoin
  } = useEventDetails();

  const { name, type, organizer, startDateTime, endDateTime } = event!;

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

      <EventStats startDateTime={startDateTime} />

      <EventDateTime startDateTime={startDateTime} endDateTime={endDateTime} />

      <ActionButtons
        isRegistered={isRegistered}
        handleJoin={handleJoin}
        handleUnjoin={handleUnjoin}
      />
    </div>
  );
}

function ManagementButtons({
  canManageEvent,
  setIsEditModalOpen,
  handleDelete
}: {
  canManageEvent: boolean;
  setIsEditModalOpen: (isOpen: boolean) => void;
  handleDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    canManageEvent && (
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsEditModalOpen(true);
          }}
          className="w-10 h-10 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-all duration-200 hover:scale-110 flex items-center justify-center group">
          <FontAwesomeIcon icon={faPenToSquare} className="text-sm group-hover:animate-pulse" />
        </button>
        <button
          onClick={handleDelete}
          className="w-10 h-10 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-all duration-200 hover:scale-110 flex items-center justify-center group">
          <FontAwesomeIcon icon={faTrash} className="text-sm group-hover:animate-pulse" />
        </button>
      </div>
    )
  );
}

function EventStats({ startDateTime }: { startDateTime: Date }) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faPerson} className="text-white text-sm" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Participants</p>
            <p className="font-bold text-indigo-700">0/10</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faCalendar} className="text-white text-sm" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Next Session</p>
            <p className="font-bold text-green-700 text-sm">{format(startDateTime, 'MMM dd')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventDateTime({ startDateTime, endDateTime }: { startDateTime: Date; endDateTime: Date }) {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl mb-8 border border-gray-200">
      <div className="flex items-center gap-3 mb-2">
        <FontAwesomeIcon icon={faClock} className="text-indigo-500" />
        <span className="font-semibold text-gray-800">Event Date</span>
      </div>
      <p className="text-gray-700 font-medium">{format(startDateTime, 'EEEE, MMMM do, yyyy')}</p>
      <p className="text-gray-600 text-sm">
        {format(startDateTime, 'h:mm a')} – {format(endDateTime, 'h:mm a')}
      </p>
    </div>
  );
}

function ActionButtons({
  handleJoin,
  handleUnjoin,
  isRegistered
}: {
  handleJoin: () => void;
  handleUnjoin: () => void;
  isRegistered: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {isRegistered ? (
          <button
            onClick={handleUnjoin}
            className="px-8 py-4 bg-gradient-to-r from-red-500 to-amber-600 hover:from-red-600 hover:to-amber-700 text-white rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-xl font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon={faTicket} />
            Unjoin Event
          </button>
        ) : (
          <button
            onClick={handleJoin}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-xl font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon={faTicket} />
            Join Event
          </button>
        )}
      </div>

      <button className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 rounded-2xl transition-all duration-200 hover:scale-110 flex items-center justify-center">
        <FontAwesomeIcon icon={faShare} />
      </button>
    </div>
  );
}
