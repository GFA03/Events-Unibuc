import { Event } from '@/models/event/Event';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faLocationDot,
  faUser,
  faTrash,
  faPenToSquare
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import CreateEventModal from './CreateEventModal';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/types/user/roles';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

type EventProps = {
  event: Event;
};

export default function EventCard({ event }: EventProps) {
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { id, name, type, dateTimes, organizer, location } = event;
  const { user } = useAuth();

  const isOrganizer = user?.userId === organizer?.id;
  const isAdmin = user?.role === Role.ADMIN;
  const canEdit = isOrganizer || isAdmin;
  const canDelete = isOrganizer || isAdmin;

  return (
    <>
      <div className="bg-slate-50 rounded-2xl shadow-lg flex flex-col justify-between h-full pb-4 overflow-clip relative group">
        <Link href={`/events/${id}`} className="flex-grow">
          <Image
            src="/hero-bg.jpg"
            alt={name}
            width={300}
            height={200}
            className="object-cover w-full h-48"
          />
          <div className="ml-4 mt-2">
            <span
              className={`inline-block ${type === 'EVENT' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'} text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded`}>
              {type}
            </span>
            <h3 className="mt-2 text-lg text-gray-900 truncate">{name}</h3>
            <div className="mt-2 flex flex-wrap flex-row items-center">
              <FontAwesomeIcon icon={faUser} className="fa-fw text-black" />
              <p className="self-center text-sm text-gray-900 truncate">{`${organizer.firstName} ${organizer.lastName}`}</p>
            </div>
            <div className="mt-2 flex flex-wrap flex-row items-center">
              <FontAwesomeIcon icon={faCalendar} className="fa-fw text-black" />
              <p className="text-sm text-gray-900 truncate">
                {dateTimes[0].startDateTime.toDateString()}
              </p>
            </div>
            <div className="mt-2 flex flex-wrap flex-row items-center">
              <FontAwesomeIcon icon={faLocationDot} className="fa-fw text-black" />
              <p className="text-sm text-gray-900 truncate">{location}</p>
            </div>
          </div>
        </Link>
        {canEdit && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsEditModalOpen(true);
            }}
            className="absolute top-2 right-12 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100">
            <FontAwesomeIcon icon={faPenToSquare} className="text-gray-600" />
          </button>
        )}
        {canDelete && (
          <button
            onClick={async (e) => {
              e.preventDefault();

              const confirmed = window.confirm('Are you sure you want to delete this event?');
              if (!confirmed) return;

              try {
                await apiClient.delete(`events/${id}`);
                toast.success('Event deleted successfully');
                await queryClient.invalidateQueries({ queryKey: ['myEvents'] });
              } catch (error) {
                console.error('Failed to delete event!', error);
                toast.error('Failed to delete event!');
              }
            }}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100">
            <FontAwesomeIcon icon={faTrash} className="text-gray-600" />
          </button>
        )}
      </div>
      <CreateEventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        event={event}
        mode="edit"
      />
    </>
  );
}
