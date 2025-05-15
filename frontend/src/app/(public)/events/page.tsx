'use client';

import EventCard from '@/components/events/EventCard';
import {useEvents} from "@/hooks/useEvents";

export default function EventsPage() {
    const { data: events = [], isLoading, isError } = useEvents();

    if (isLoading) return <p>Loading events...</p>;
    if (isError) return <p>Failed to load events...</p>;

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-6">All Events</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => <EventCard key={event.id} event={event} />)}
            </div>
        </div>
    );
}
