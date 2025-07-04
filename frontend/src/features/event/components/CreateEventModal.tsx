import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faTag,
  faTimes,
  faCalendarDays,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Event } from '@/features/event/model';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { useTags } from '@/features/tag/hooks';
import { eventService } from '@/features/event/service';
import ImageUpload from '@/components/ui/common/ImageUpload';

const createEventSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  description: z.string().min(10, 'Description must have at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
  noParticipants: z.number().int().positive('Must be greater than 0').optional(),
  startDateTime: z.string().min(1, 'Start date is required'),
  endDateTime: z.string().min(1, 'End date is required'),
  tagIds: z.array(z.string()).optional()
});

export type CreateEventFormInputs = z.infer<typeof createEventSchema>;

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
  const { data: availableTags } = useTags();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<CreateEventFormInputs>({
    resolver: zodResolver(createEventSchema)
  });

  const [hasParticipantLimit, setHasParticipantLimit] = useState(false);

  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => {
    if (event && mode === 'edit') {
      setValue('name', event.name);
      setValue('type', event.type);
      setValue('description', event.description);
      setValue('location', event.location);
      setValue('startDateTime', event.startDateTime.toISOString().slice(0, 16));
      setValue('endDateTime', event.endDateTime.toISOString().slice(0, 16));

      if (event.tags && event.tags.length > 0) {
        const tagIds = event.tags.map((tag) => tag.id);
        setSelectedTags(tagIds);
        setValue('tagIds', tagIds);
      }
    } else {
      setSelectedTags([]);
      setValue('tagIds', []);
    }
  }, [event, mode, setValue]);

  const handleTagToggle = (tagId: string) => {
    const updatedTags = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];

    setSelectedTags(updatedTags);
    setValue('tagIds', updatedTags);
  };

  const removeTag = (tagId: string) => {
    const updatedTags = selectedTags.filter((id) => id !== tagId);
    setSelectedTags(updatedTags);
    setValue('tagIds', updatedTags);
  };

  const getTagById = (tagId: string) => {
    return availableTags?.find((tag) => tag.id === tagId);
  };

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file);
    setRemoveImage(false);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setRemoveImage(true);
  };

  const onSubmit = async (data: CreateEventFormInputs) => {
    try {
      if (mode === 'edit' && event) {
        await eventService.updateEvent(event.id, data, selectedImage, removeImage);
        toast.success('Event updated successfully!');
        await queryClient.invalidateQueries({ queryKey: ['event', event.id] });
      } else {
        await eventService.createEvent(data, selectedImage);
        toast.success('Event created successfully!');
      }
      await queryClient.invalidateQueries({ queryKey: ['myEvents'] });
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.invalidateQueries({ queryKey: ['tagsEvents'] });
      onClose();
      reset();
      router.push('/manage-events');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data?.message);
        // Handle multiple error messages from the server
        if (error.response?.data?.message.length > 1) {
          error.response?.data?.message.map((msg: string) => toast.error(msg));
        } else {
          toast.error(error.response?.data?.message || `Failed to ${mode} event`);
        }
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
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={hasParticipantLimit}
                  onChange={(e) => {
                    setHasParticipantLimit(e.target.checked);
                    if (!e.target.checked) setValue('noParticipants', undefined);
                  }}
                />
                Limit number of participants
              </label>

              {hasParticipantLimit && (
                <div>
                  <input
                    type="number"
                    {...register('noParticipants', { valueAsNumber: true })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                    placeholder="Maximum number of participants"
                    min={1}
                  />
                  {errors.noParticipants && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      {errors.noParticipants.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Tags Section */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 group-hover:border-gray-300 bg-white text-left flex items-center justify-between">
                  <span className="text-gray-500">
                    {selectedTags.length > 0
                      ? `${selectedTags.length} tag(s) selected`
                      : 'Select tags'}
                  </span>
                  <FontAwesomeIcon icon={faTag} className="text-gray-400" />
                </button>

                {/* Selected Tags Display */}
                {selectedTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedTags.map((tagId) => {
                      const tag = getTagById(tagId);
                      return tag ? (
                        <span
                          key={tagId}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                          {tag.name}
                          <button
                            type="button"
                            onClick={() => removeTag(tagId)}
                            className="hover:bg-indigo-200 rounded-full p-1 transition-colors duration-200">
                            <FontAwesomeIcon icon={faTimes} className="text-xs" />
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}

                {/* Dropdown */}
                {isTagDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                    {availableTags && availableTags.length > 0 ? (
                      availableTags.map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleTagToggle(tag.id)}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between ${
                            selectedTags.includes(tag.id)
                              ? 'bg-indigo-50 text-indigo-800'
                              : 'text-gray-700'
                          }`}>
                          <span>{tag.name}</span>
                          {selectedTags.includes(tag.id) && (
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500 text-center">No tags available</div>
                    )}
                  </div>
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
                            {errors?.endDateTime?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <ImageUpload
              currentImage={event?.imageUrl || ''}
              onImageChange={handleImageChange}
              onRemoveImage={handleRemoveImage}
            />

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
