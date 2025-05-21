'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEvent } from '@/hooks/useEvent';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faPerson,
  faHeart,
  faCalendar,
  faInfoCircle,
  faShare,
  faPenToSquare,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/common/Button';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import WithLoader from '@/components/common/WithLoader';
import { Role } from '@/types/user/roles';
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import CreateEventModal from '@/components/events/CreateEventModal';

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: event, isLoading, isError } = useEvent(id);
  const { user, isAuthenticated } = useAuth();
  const isOrganizer = user?.userId === event?.organizerId;
  const isAdmin = user?.role === Role.ADMIN;
  const canManageEvent = isOrganizer || isAdmin;

  const handleJoin = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      await apiClient.post('registrations', {
        eventDateTimeId: event?.dateTimes[0].id
      });
      toast.success('Registration successful');
    } catch (error) {
      console.error('Registration failed!', error);
      toast.error('Registration failed!');
    }
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this event?');
    if (!confirmed) return;

    try {
      await apiClient.delete(`events/${id}`);
      toast.success('Event deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['myEvents'] });
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.invalidateQueries({ queryKey: ['event', id] });
    } catch (error) {
      console.error('Failed to delete event!', error);
      toast.error('Failed to delete event!');
    }
  };

  if (!event) return <p>Event not found.</p>;

  const { name, type, description, dateTimes, organizerId, location } = event;

  return (
    <>
      <WithLoader isLoading={isLoading} isError={isError} errorMessage={'Failed to load event'}>
        <div className="min-h-screen bg-gray-100 text-black">
          {/* Header section */}
          <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md max-w-5xl mx-auto mt-6">
            <Image
              src="/hero-bg.jpg"
              alt={name}
              width={600}
              height={400}
              className="object-cover w-full md:w-1/2"
            />

            <div className="flex flex-col gap-4 p-6 w-full">
              <div className="flex justify-between items-center mb-6">
                <p className="bg-red-300 text-sm font-medium px-3 py-1 rounded-xl self-start capitalize">
                  {type}
                </p>
                {/* EDIT AND CANCEL EVENT BUTTONS */}
                {canManageEvent && (
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsEditModalOpen(true);
                      }}
                      className="p-2 bg-white rounded-full shadow-md opacity-50 group-hover:opacity-100 hover:bg-gray-400">
                      <FontAwesomeIcon icon={faPenToSquare} className="text-gray-600" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-2 bg-white rounded-full shadow-md opacity-50 group-hover:opacity-100 hover:bg-gray-400">
                      <FontAwesomeIcon icon={faTrash} className="text-black" />
                    </button>
                  </div>
                )}
              </div>

              <h1 className="text-3xl font-bold">{name}</h1>
              <p className="text-sm text-gray-500">Organized by: {organizerId}</p>

              <div className="flex items-center gap-2 text-gray-700">
                <FontAwesomeIcon icon={faPerson} />
                <p className="text-sm">0/10 Participants</p>
              </div>

              <div className="flex items-center gap-2 text-gray-700 relative group">
                <FontAwesomeIcon icon={faCalendar} />
                <p className="text-sm">
                  {format(dateTimes[0].startDateTime, 'PPpp')} –{' '}
                  {format(dateTimes[0].endDateTime, 'PPpp')}
                </p>

                {/* Info tooltip for upcoming dates (If there is more than one date */}
                {dateTimes.length > 1 && (
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="ml-2 text-gray-500 cursor-pointer"
                    />
                    <div className="absolute left-0 top-6 z-10 hidden group-hover:block bg-white border border-gray-300 rounded-md shadow-lg p-3 text-sm w-60">
                      <p className="font-semibold mb-2 text-center text-gray-800">Upcoming Dates</p>
                      <ul className="list-disc ml-4 space-y-1 text-gray-700">
                        {dateTimes.map((dt) =>
                          dt.id !== dateTimes[0].id ? (
                            <li key={dt.id}>{format(dt.startDateTime, 'PPpp')}</li>
                          ) : null
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-4">
                  <Button onClick={handleJoin}>Join</Button>
                  <FontAwesomeIcon icon={faHeart} className="text-red-500 cursor-pointer" />
                </div>
                <FontAwesomeIcon icon={faShare} className="cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Description section */}
          <div className="max-w-5xl mx-auto mt-8 bg-white rounded-lg shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Event Details</h2>
            <div className="flex items-center gap-3 text-gray-700">
              <FontAwesomeIcon icon={faLocationDot} />
              <p>{location}</p>
            </div>
            <p className="text-gray-800">{description}</p>
          </div>
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
