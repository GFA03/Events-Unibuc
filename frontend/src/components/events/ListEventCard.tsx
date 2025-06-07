import Link from 'next/link';
import { Event } from '@/features/event/model';
import { faCalendar, faLocationDot, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { format } from 'date-fns';
import TagCard from '@/components/tags/TagCard';
import { Share2 } from 'lucide-react';
import { handleShare } from '@/features/event/utils';
import { eventTypeColor } from '@/features/event/types/eventType';

export default function ListEventCard({ event }: { event: Event }) {
  const { id, name, type, startDateTime, endDateTime, imageUrl, organizer, tags, location } = event;

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

  if (!organizer) {
    return <p className="text-red-500">Organizer not found!</p>;
  }

  return (
    <div className="bg-slate-50 rounded-2xl shadow-lg overflow-hidden flex flex-row ml-4 mr-4 md:ml-16 md:mr-16 lg:ml-32 lg:mr-32 mb-4">
      <Link href={`/events/${id}`} className="flex w-full">
        {/* Image on the left for list view */}
        <div className="flex">
          <Image
            src={imageUrl ? `${baseUrl}${imageUrl}` : '/unibuc-event-logo.png'}
            alt={name}
            width={400}
            height={400}
            className="object-contain w-80 h-64 bg-white"
          />
        </div>

        {/* Content on the right for list view */}
        <div className="flex-1 bg-white p-4 flex flex-col justify-between">
          <div>
            <span
              className={`inline-block ${eventTypeColor(type)} text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded`}>
              {type}
            </span>
            <h3 className="mt-2 text-lg text-gray-900 truncate">{name}</h3>
            {/* Tags section */}
            {tags && tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <TagCard key={tag.id} tag={tag} size="small" />
                ))}
              </div>
            )}
          </div>

          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faUser} className="fa-fw text-black mr-2" />
              <p className="text-sm text-gray-900 truncate">{`${organizer.firstName} ${organizer.lastName}`}</p>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCalendar} className="fa-fw text-black mr-2" />
              <p className="text-sm text-gray-900 truncate">
                {format(startDateTime, 'dd MMMM hh:mm')} - {format(endDateTime, 'dd MMMM hh:mm')}
              </p>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faLocationDot} className="fa-fw text-black mr-2" />
              <p className="text-sm text-gray-900 truncate">{location}</p>
            </div>
          </div>
        </div>
      </Link>
      <button
        onClick={(e) => handleShare(e, event)}
        className="absolute bottom-2 right-2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Share event">
        <Share2 size={16} className="text-gray-700" />
      </button>
    </div>
  );
}
