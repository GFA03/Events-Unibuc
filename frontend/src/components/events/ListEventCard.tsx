import Link from 'next/link';
import { Event } from '@/models/event/Event';
import { faCalendar, faLocationDot, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { format } from 'date-fns';

export default function ListEventCard({ event }: { event: Event }) {
  const { id, name, type, startDateTime, endDateTime, organizer, location } = event;

  return (
    <div className="bg-slate-50 rounded-2xl shadow-lg overflow-hidden flex flex-row ml-44 mr-44">
      <Link href={`/events/${id}`} className="flex">
        {/* Image on the left for list view */}
        <div className="flex">
          <Image
            src={'/unibuc-event-logo.png'}
            alt={name}
            width={400}
            height={400}
            className="object-contain w-64 h-48 bg-white"
          />
        </div>

        {/* Content on the right for list view */}
        <div className="flex-1 bg-white p-4 flex flex-col justify-between">
          <div>
            <span
              className={`inline-block ${type === 'EVENT' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'} text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded`}>
              {type}
            </span>
            <h3 className="mt-2 text-lg text-gray-900 truncate">{name}</h3>
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
    </div>
  );
}
