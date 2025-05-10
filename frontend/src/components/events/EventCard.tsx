import {Event} from "@/types/event";
import Image from 'next/image';
import Link from "next/link";

type EventProps = {
    event: Event;
}

export default function EventCard({event}: EventProps) {
    const {id, name, type, organizer, location} = event;
    return (
        <Link href={`/event/${id}`}>
            <div className="bg-slate-50 rounded-2xl shadow-lg flex flex-col justify-between h-full pb-4 overflow-clip">
              <Image src="/hero-bg.jpg" alt={name} width={300} height={200} className="object-cover w-full h-48" />
              <div className="ml-4 mt-2">
                <span
                  className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded">
                    {type}
                </span>
                <h3 className="mt-2 text-lg text-gray-900 truncate">
                    {name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-900 truncate">{organizer}</p>
                  <p className="mt-2 text-sm text-gray-900 truncate">{location}</p>
              </div>
            </div>
        </Link>
    );
}