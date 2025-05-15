'use client';

import { useParams } from 'next/navigation';
import { useEvent } from '@/hooks/useEvent';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLocationDot,
    faPerson,
    faHeart,
    faCalendar,
    faInfoCircle,
    faShare
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/common/Button';
import { format } from 'date-fns';

export default function EventDetailsPage() {
    const params = useParams();
    const id = typeof params?.id === 'string' ? params.id : '';

    const { data: event, isLoading, error } = useEvent(id);

    if (isLoading) return <p>Loading event...</p>;
    if (error) return <p>Error loading event: {(error as Error).message}</p>;
    if (!event) return <p>Event not found.</p>;

    const { name, type, description, dateTimes, organizerId, location } = event;

    return (
        <div className="min-h-screen bg-gray-100 text-black">
            {/* Header section */}
            <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md max-w-5xl mx-auto mt-6">
                <Image
                    src="/hero-bg.jpg"
                    alt={name}
                    width={600}
                    height={400}
                    className="object-cover w-full md:w-1/2"
                />

                <div className="flex flex-col gap-4 p-6 w-full">
                    <p className="bg-red-300 text-sm font-medium px-3 py-1 rounded-xl self-start capitalize">
                        {type}
                    </p>

                    <h1 className="text-3xl font-bold">{name}</h1>
                    <p className="text-sm text-gray-500">Organized by: {organizerId}</p>

                    <div className="flex items-center gap-2 text-gray-700">
                        <FontAwesomeIcon icon={faPerson} />
                        <p className="text-sm">0/10 Participants</p>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700 relative group">
                        <FontAwesomeIcon icon={faCalendar} />
                        <p className="text-sm">
                            {format(dateTimes[0].startDateTime, 'PPpp')} –{' '}
                            {format(dateTimes[0].endDateTime, 'PPpp')}
                        </p>

                        {/* Info tooltip */}
                        <div className="relative">
                            <FontAwesomeIcon
                                icon={faInfoCircle}
                                className="ml-2 text-gray-500 cursor-pointer"
                            />
                            <div className="absolute left-0 top-6 z-10 hidden group-hover:block bg-white border border-gray-300 rounded-md shadow-lg p-3 text-sm w-60">
                                <p className="font-semibold mb-2 text-center text-gray-800">Upcoming Dates</p>
                                <ul className="list-disc ml-4 space-y-1 text-gray-700">
                                    {dateTimes.map((dt) => (
                                        {...dt != dateTimes[0] ? <li key={dt.id}>
                                                {format(dt.startDateTime, 'PPpp')}
                                            </li> : <></>}
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-4">
                            <Button>Join</Button>
                            <FontAwesomeIcon icon={faHeart} className="text-red-500 cursor-pointer" />
                        </div>
                        <FontAwesomeIcon icon={faShare} className="cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* Description section */}
            <div className="max-w-5xl mx-auto mt-8 bg-white rounded-lg shadow-md p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Event Details</h2>
                <div className="flex items-center gap-3 text-gray-700">
                    <FontAwesomeIcon icon={faLocationDot} />
                    <p>{location}</p>
                </div>
                <p className="text-gray-800">{description}</p>
            </div>
        </div>
    );
}
