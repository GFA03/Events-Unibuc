import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useEventDetails } from '@/features/event/hooks/useEventDetails';
import Link from 'next/link';

export default function EventDetails() {
  const { event } = useEventDetails();
  if (!event) {
    return null;
  }
  const { description, location } = event;

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8">
      <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            Event Details
          </h2>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{description}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faLocationDot} className="text-indigo-500" />
                  Location
                </h3>
                <Link
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline break-words"
                >
                  {location}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
