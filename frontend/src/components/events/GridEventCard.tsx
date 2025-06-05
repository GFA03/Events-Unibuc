import { Event } from '@/features/event/model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faLocationDot, faUser } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import TagCard from '@/components/tags/TagCard';
import { handleShare } from '@/features/event/utils';
import { Share2 } from 'lucide-react';

export default function GridEventCard({ event }: { event: Event }) {
  const { id, name, type, startDateTime, imageUrl, endDateTime, tags, organizer, location } = event;

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

  if (!organizer) {
    return <p className="text-red-500">Organizer not found!</p>;
  }

  return (
    <div className="bg-slate-50 rounded-2xl shadow-lg flex flex-col justify-between h-full overflow-clip relative group">
      <button
        onClick={(e) => handleShare(e, event)}
        className="absolute bottom-2 right-2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Share event">
        <Share2 size={16} className="text-gray-700" />
      </button>
      <Link href={`/events/${id}`} className="flex-grow">
        <Image
          src={imageUrl ? `${baseUrl}${imageUrl}` : '/unibuc-event-logo.png'}
          alt={name}
          width={300}
          height={200}
          className="object-contain w-full bg-white h-48"
        />
        <div className="bg-white pb-4 pl-4 pr-4 pt-2">
          <span
            className={`inline-block ${type === 'EVENT' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'} text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded`}>
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
          <div className="mt-2 flex flex-wrap flex-row items-center">
            <FontAwesomeIcon icon={faUser} className="fa-fw text-black" />
            <p className="self-center text-sm text-gray-900 truncate">{`${organizer.firstName} ${organizer.lastName}`}</p>
          </div>
          <div className="mt-2 flex flex-wrap flex-row items-center">
            <FontAwesomeIcon icon={faCalendar} className="fa-fw text-black" />
            <p className="text-sm text-gray-900 truncate">
              {format(startDateTime, 'dd MMMM hh:mm')} - {format(endDateTime, 'dd MMMM hh:mm')}
            </p>
          </div>
          <div className="mt-2 flex flex-wrap flex-row items-center">
            <FontAwesomeIcon icon={faLocationDot} className="fa-fw text-black" />
            <p className="text-sm text-gray-900 truncate">{location}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
