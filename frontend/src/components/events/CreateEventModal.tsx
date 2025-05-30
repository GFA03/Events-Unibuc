import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCalendarDays, faClock } from '@fortawesome/free-solid-svg-icons';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Event } from '@/models/event/Event';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

const createEventSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  startDateTime: z.string().min(1, 'Start date is required'),
  endDateTime: z.string().min(1, 'End date is required')
});

type CreateEventFormInputs = z.infer<typeof createEventSchema>;

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event;
  mode?: 'create' | 'edit';
}

export default function CreateEventModal({
  isOpen,
  onClose,
  event,
  mode = 'create'
}: CreateEventModalProps) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<CreateEventFormInputs>({
    resolver: zodResolver(createEventSchema)
  });

  const router = useRouter();

  useEffect(() => {
    if (event && mode === 'edit') {
      setValue('name', event.name);
      setValue('type', event.type);
      setValue('description', event.description);
      setValue('location', event.location);
      setValue('startDateTime', event.startDateTime.toISOString().slice(0, 16));
      setValue('endDateTime', event.endDateTime.toISOString().slice(0, 16));
    }
  }, [event, mode, setValue]);

  const onSubmit = async (data: CreateEventFormInputs) => {
    try {
      if (mode === 'edit' && event) {
        await apiClient.patch(`/events/${event.id}`, data);
        toast.success('Event updated successfully!');
        await queryClient.invalidateQueries({ queryKey: ['event', event.id] });
      } else {
        await apiClient.post('/events', data);
        toast.success('Event created successfully!');
      }
      await queryClient.invalidateQueries({ queryKey: ['myEvents'] });
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      onClose();
      reset();
      router.push('/manage-events');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data?.message);
        toast.error(error.response?.data?.message || `Failed to ${mode} event`);
        return;
      }
      console.error('Unexpected error:', error);
      toast.error(`Failed to ${mode} event`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 rounded-t-3xl p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faCalendarDays} className="text-white text-lg" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {mode === 'edit' ? 'Edit Event' : 'Create New Event'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 group">
            <FontAwesomeIcon
              icon={faXmark}
              className="text-gray-500 group-hover:text-gray-700 transition-colors duration-200"
            />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 group-hover:border-gray-300"
                    placeholder="Enter event name"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="group">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type
                  </label>
                  <select
                    id="type"
                    {...register('type')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 group-hover:border-gray-300 bg-white">
                    <option value="">Select a type</option>
                    <option value="EVENT">Event</option>
                    <option value="WORKSHOP">Workshop</option>
                  </select>
                  {errors.type && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                      {errors.type.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="group">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 group-hover:border-gray-300 resize-none"
                  placeholder="Describe your event..."
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="group">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  {...register('location')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 group-hover:border-gray-300"
                  placeholder="Enter event location"
                />
                {errors.location && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>

            {/* Date Times Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Event Dates & Times
                </h3>
              </div>

              <div className="space-y-4">
                <div className="group animate-in slide-in-from-top-2 duration-300">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faClock} className="text-indigo-500" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          {...register(`startDateTime`)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 bg-white"
                        />
                        {errors.startDateTime && (
                          <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                            <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                            {errors.startDateTime?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          {...register(`endDateTime`)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 bg-white"
                        />
                        {errors.endDateTime && (
                          <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                            <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                            {errors?.endDateTime?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 hover:scale-105 font-medium">
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg font-medium">
                {mode === 'edit' ? 'Save Changes' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
