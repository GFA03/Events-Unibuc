'use client';

import Image from 'next/image';
import Link from 'next/link';
import EventCard from '@/components/events/EventCard';
import FeatureHighlight from '@/components/FeatureHighlight';
import { useEvents } from '@/hooks/events/useEvents';
import WithLoader from '@/components/common/WithLoader';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data, isLoading, isError, error } = useEvents();

  console.log('Home page data:', data, 'Loading:', isLoading, 'Error:', isError);
  console.log('Home page error:', error);

  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/events');
    }
  }, [isAuthenticated, router]);

  const events = data?.events || [];

  return (
    <WithLoader isLoading={isLoading} isError={isError}>
      <main className="w-full">
        <section className="relative h-screen w-full bg-blue-300">
          <Image
            src="/hero-bg.jpg"
            alt="Students socializing"
            layout="fill"
            objectFit="cover"
            className="opacity-80"
          />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">
              The place where you can make friends
            </h1>
            <p className="mt-4 text-lg md:text-2xl text-gray-100">
              University of Bucharest is here to help you socialize
            </p>
            <Link
              href="/events"
              className="mt-8 inline-block bg-white text-indigo-700 font-semibold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-transform">
              See all events
            </Link>
          </div>
        </section>
        <section className="min-h-screen w-full bg-orange-50 py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-black mb-8">Upcoming events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.slice(0, 6).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            <div className="text-right">
              <Link
                href="/events"
                className="mt-8 inline-block bg-white text-indigo-700 font-semibold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-transform">
                See all events
              </Link>
            </div>
          </div>
        </section>
        <section className="min-h-screen w-full flex flex-col justify-between gap-8 sm:gap-16 md:gap-32 bg-cyan-700 py-16">
          <FeatureHighlight
            title="Find people with the same values"
            imageSrc="/hero-bg.jpg"
            alt="Find people"
            items={[
              'Joining an event has never been easier',
              'Filter by interests, date, and location',
              'Build lasting connections'
            ]}
          />
          <FeatureHighlight
            title="Plan your own events effortlessly"
            imageSrc="/hero-bg.jpg"
            alt="Easy planning"
            items={[
              'Create event pages in minutes',
              'Invite friends with a click',
              'Manage RSVPs seamlessly'
            ]}
            reverse
          />
          <FeatureHighlight
            title="Stay updated on campus life"
            imageSrc="/hero-bg.jpg"
            alt="Stay updated"
            items={[
              'Real-time notifications',
              'Subscribe to categories you love',
              'Never miss an opportunity'
            ]}
          />
        </section>
      </main>
    </WithLoader>
  );
}
