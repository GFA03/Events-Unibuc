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
  faShare,
  faPenToSquare,
  faTrash,
  faUsers,
  faClock,
  faXmark,
  faCheck,
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

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedDateTimeId, setSelectedDateTimeId] = useState<string>('');
  const [isJoining, setIsJoining] = useState(false);

  const { data: event, isLoading, isError } = useEvent(id);
  const { user, isAuthenticated } = useAuth();
  const isOrganizer = user?.userId === event?.organizerId;
  const isAdmin = user?.role === Role.ADMIN;
  const canManageEvent = isOrganizer || isAdmin;

  const handleJoinClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setIsJoinModalOpen(true);
  };

  const handleJoinConfirm = async () => {
    if (!selectedDateTimeId) {
      toast.error('Please select a date to join');
      return;
    }

    setIsJoining(true);
    try {
      await apiClient.post('registrations', {
        eventDateTimeId: selectedDateTimeId
      });
      toast.success('Registration successful!');
      setIsJoinModalOpen(false);
      setSelectedDateTimeId('');
      // Optionally refetch event data to update participant count
      await queryClient.invalidateQueries({ queryKey: ['event', id] });
    } catch (error: any) {
      console.error('Registration failed!', error);
      toast.error(error.response?.data?.message || 'Registration failed!');
    } finally {
      setIsJoining(false);
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
    } catch (error) {
      console.error('Failed to delete event!', error);
      toast.error('Failed to delete event!');
    }
  };

  if (!event) return <p>Event not found.</p>;

  const { name, type, description, dateTimes, organizer, location } = event;

  // Join Modal Component
  const JoinModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 rounded-t-3xl p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faTicket} className="text-white text-lg" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Select Event Date
            </h2>
          </div>
          <button
            onClick={() => {
              setIsJoinModalOpen(false);
              setSelectedDateTimeId('');
            }}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 group"
          >
            <FontAwesomeIcon icon={faXmark} className="text-gray-500 group-hover:text-gray-700 transition-colors duration-200" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">Choose which date you&#39;d like to attend:</p>

          <div className="space-y-3 mb-8">
            {dateTimes.map((dateTime, index) => (
              <div
                key={dateTime.id}
                onClick={() => setSelectedDateTimeId(dateTime.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                  selectedDateTimeId === dateTime.id
                    ? 'border-green-500 bg-green-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                      selectedDateTimeId === dateTime.id
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedDateTimeId === dateTime.id && (
                        <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Session {index + 1}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FontAwesomeIcon icon={faClock} className="text-xs" />
                        <span>
                          {format(dateTime.startDateTime, 'PPpp')} – {format(dateTime.endDateTime, 'p')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <FontAwesomeIcon icon={faUsers} className="text-xs" />
                      <span>0/10</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => {
                setIsJoinModalOpen(false);
                setSelectedDateTimeId('');
              }}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 hover:scale-105 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleJoinConfirm}
              disabled={!selectedDateTimeId || isJoining}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isJoining ? 'Joining...' : 'Join Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
                        {dateTimes.length > 1 && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            {dateTimes.length} Sessions
                          </span>
                        )}
                      </div>

                      {/* Management Buttons */}
                      {canManageEvent && (
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setIsEditModalOpen(true);
                            }}
                            className="w-10 h-10 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-all duration-200 hover:scale-110 flex items-center justify-center group"
                          >
                            <FontAwesomeIcon icon={faPenToSquare} className="text-sm group-hover:animate-pulse" />
                          </button>
                          <button
                            onClick={handleDelete}
                            className="w-10 h-10 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-all duration-200 hover:scale-110 flex items-center justify-center group"
                          >
                            <FontAwesomeIcon icon={faTrash} className="text-sm group-hover:animate-pulse" />
                          </button>
                        </div>
                      )}
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                      {name}
                    </h1>

                    <p className="text-gray-600 mb-6 flex items-center gap-2">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      Organized by: {organizer.firstName} {organizer.lastName}
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
                              {format(dateTimes[0].startDateTime, 'MMM dd')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Primary Date Display */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl mb-8 border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <FontAwesomeIcon icon={faClock} className="text-indigo-500" />
                        <span className="font-semibold text-gray-800">
                          {dateTimes.length > 1 ? 'Next Session' : 'Event Date'}
                        </span>
                      </div>
                      <p className="text-gray-700 font-medium">
                        {format(dateTimes[0].startDateTime, 'EEEE, MMMM do, yyyy')}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {format(dateTimes[0].startDateTime, 'h:mm a')} – {format(dateTimes[0].endDateTime, 'h:mm a')}
                      </p>

                      {dateTimes.length > 1 && (
                        <p className="text-indigo-600 text-sm mt-2 font-medium">
                          +{dateTimes.length - 1} more session{dateTimes.length > 2 ? 's' : ''}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={handleJoinClick}
                          className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-xl font-semibold flex items-center gap-2"
                        >
                          <FontAwesomeIcon icon={faTicket} />
                          Join Event
                        </button>

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

                    {dateTimes.length > 1 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">All Sessions</h3>
                        <div className="space-y-3">
                          {dateTimes.map((dateTime, index) => (
                            <div key={dateTime.id} className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-gray-800">Session {index + 1}</p>
                                  <p className="text-sm text-gray-600">
                                    {format(dateTime.startDateTime, 'EEEE, MMMM do, yyyy')}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {format(dateTime.startDateTime, 'h:mm a')} – {format(dateTime.endDateTime, 'h:mm a')}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <FontAwesomeIcon icon={faUsers} className="text-xs" />
                                    <span>0/10</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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

      {isJoinModalOpen && <JoinModal />}
    </>
  );
}