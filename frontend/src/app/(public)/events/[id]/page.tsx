'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEvent } from '@/hooks/events/useEvent';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faPerson,
  faHeart,
  faCalendar,
  faShare,
  faPenToSquare,
  faTrash,
  faClock,
  faTicket
} from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import WithLoader from '@/components/common/WithLoader';
import { Role } from '@/types/user/roles';
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import CreateEventModal from '@/components/events/CreateEventModal';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRegistration } from '@/hooks/registrations/useRegistration';

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

  const { data: registration } = useRegistration(id);
  const isRegistered = !!registration;

  const handleJoin = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isRegistered) {
      toast.error('You are already registered for this event.');
      return;
    }

    try {
      await apiClient.post('registrations', {
        eventId: event?.id
      });
      toast.success('Registration successful!');
      // Optionally refetch event data to update participant count
      await queryClient.invalidateQueries({ queryKey: ['event', id] });
      await queryClient.invalidateQueries({ queryKey: ['registration', id] });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Registration failed!', error);
        toast.error(error.response?.data?.message || 'Registration failed!');
        return;
      }
      console.error('Registration failed!', error);
      toast.error('Registration failed!');
    }
  };

  const handleUnjoin = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!isRegistered) {
      toast.error('You are not registered for this event.');
      return;
    }

    try {
      await apiClient.delete(`registrations/${registration?.id}`);
      toast.success('Unregistration successful!');
      // Optionally refetch event data to update participant count
      await queryClient.invalidateQueries({ queryKey: ['event', id] });
      await queryClient.invalidateQueries({ queryKey: ['registration', id] });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Unregistration failed!', error);
        toast.error(error.response?.data?.message || 'Unregistration failed!');
        return;
      }
      console.error('Unregistration failed!', error);
      toast.error('Unregistration failed!');
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
      router.push('/events');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Failed to delete event!', error);
        toast.error(error.response?.data?.message || 'Failed to delete event!');
        return;
      }
      console.error('Failed to delete event!', error);
      toast.error('Failed to delete event!');
    }
  };

  if (!event) return <p>Event not found.</p>;

  const { name, type, description, startDateTime, endDateTime, organizer, location } = event;

  return (
    <>
      <WithLoader isLoading={isLoading} isError={isError} errorMessage={'Failed to load event'}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Hero Section */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-lg">
                <div className="flex flex-col lg:flex-row">
                  {/* Image Section */}
                  <div className="lg:w-1/2 relative">
                    <Image
                      src="/hero-bg.jpg"
                      alt={name}
                      width={600}
                      height={400}
                      className="object-cover w-full h-64 lg:h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  {/* Content Section */}
                  <div className="lg:w-1/2 p-8 lg:p-12">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-full capitalize shadow-lg">
                          {type}
                        </span>
                      </div>

                      {/* Management Buttons */}
                      {canManageEvent && (
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setIsEditModalOpen(true);
                            }}
                            className="w-10 h-10 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-all duration-200 hover:scale-110 flex items-center justify-center group">
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              className="text-sm group-hover:animate-pulse"
                            />
                          </button>
                          <button
                            onClick={handleDelete}
                            className="w-10 h-10 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-all duration-200 hover:scale-110 flex items-center justify-center group">
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="text-sm group-hover:animate-pulse"
                            />
                          </button>
                        </div>
                      )}
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

                    {/* Event Stats */}
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
                            <p className="font-bold text-green-700 text-sm">
                              {format(startDateTime, 'MMM dd')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Date and Time Section */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl mb-8 border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <FontAwesomeIcon icon={faClock} className="text-indigo-500" />
                        <span className="font-semibold text-gray-800">Event Date</span>
                      </div>
                      <p className="text-gray-700 font-medium">
                        {format(startDateTime, 'EEEE, MMMM do, yyyy')}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {format(startDateTime, 'h:mm a')} – {format(endDateTime, 'h:mm a')}
                      </p>
                    </div>

                    {/* Action Buttons */}
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

                        <button className="w-12 h-12 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-2xl transition-all duration-200 hover:scale-110 flex items-center justify-center">
                          <FontAwesomeIcon icon={faHeart} />
                        </button>
                      </div>

                      <button className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 rounded-2xl transition-all duration-200 hover:scale-110 flex items-center justify-center">
                        <FontAwesomeIcon icon={faShare} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="max-w-7xl mx-auto px-4 pb-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  Event Details
                </h2>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">Description</h3>
                      <p className="text-gray-700 leading-relaxed">{description}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FontAwesomeIcon icon={faLocationDot} className="text-indigo-500" />
                        Location
                      </h3>
                      <p className="text-gray-700">{location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </WithLoader>

      {/* Modals */}
      <CreateEventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        event={event}
        mode="edit"
      />
    </>
  );
}
