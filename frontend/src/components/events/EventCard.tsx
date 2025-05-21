import { Event } from '@/models/event/Event';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faLocationDot, faUser } from '@fortawesome/free-solid-svg-icons';

type EventProps = {
  event: Event;
};

export default function EventCard({ event }: EventProps) {
  const { id, name, type, dateTimes, organizer, location } = event;

  return (
    <div className="bg-slate-50 rounded-2xl shadow-lg flex flex-col justify-between h-full overflow-clip relative group">
      <Link href={`/events/${id}`} className="flex-grow">
        <Image
          src={'/unibuc-event-logo.png'}
          alt={name}
          width={300}
          height={200}
          className="object-contain w-full bg-white h-48"
        />
        <div className="bg-amber-50 pb-4 pl-4 pr-4 pt-2">
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
    </div>
  );
}
