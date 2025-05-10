import { Event } from '@/types/event';
import Image from 'next/image';
import Link from "next/link";
import EventCard from '@/components/events/EventCard';
import {EventDateTime} from "@/types/eventDateTime";

export default function Home() {
    const dateTime: EventDateTime = {
        startDateTime: new Date("2025-05-20T00:00:00Z"),
        endDateTime: new Date("2025-05-21T00:00:00Z"),
        eventId: "aaa",
    }

    const ev:Event = {
    id: "aaa",
    name: "blabla",
    type: "WORKSHOP",
    image: "aa",
    description: "lalala",
    location: "aaa",
    dateTimes: [dateTime],
    organizer: "aa",
    createdAt: Date(),
    updatedAt: Date(),
  }

  const events = Array(6).fill(ev);

  return (
        // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="w-full">
            <section className="relative h-screen w-full bg-blue-400">
                <Image
                    src="/hero-bg.jpg"
                    alt="Students socializing"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-50"
                />
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">
                        The place where you can make friends
                    </h1>
                    <p className="mt-4 text-lg md:text-2xl text-gray-100">
                        University of Bucharest is here to help you socialize
                    </p>
                    <Link href="/events"
                          className="mt-8 inline-block bg-white text-indigo-700 font-semibold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-transform">
                        See all events
                    </Link>
                </div>
            </section>
            <section className="min-h-screen w-full bg-orange-50 py-16 px-6">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-3xl font-bold text-black mb-8">
                    Upcoming events
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                  <div className="text-right">
                    <Link href="/events" className="mt-8 inline-block bg-white text-indigo-700 font-semibold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-transform">
                    See all events
                  </Link>
                  </div>
                </div>
            </section>
            <section className="min-h-screen w-full">
                Prezentare evenimente
            </section>
        </main>
    );
}
