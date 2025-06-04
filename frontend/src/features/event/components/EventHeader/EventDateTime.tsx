import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import React from 'react';

export default function EventDateTime({
  startDateTime,
  endDateTime
}: {
  startDateTime: Date;
  endDateTime: Date;
}) {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl mb-8 border border-gray-200">
      <div className="flex items-center gap-3 mb-2">
        <FontAwesomeIcon icon={faClock} className="text-indigo-500" />
        <span className="font-semibold text-gray-800">Event Date</span>
      </div>
      <p className="text-gray-700 font-medium">{format(startDateTime, 'EEEE, MMMM do, yyyy')}</p>
      <p className="text-gray-600 text-sm">
        {format(startDateTime, 'h:mm a')} – {format(endDateTime, 'h:mm a')}
      </p>
    </div>
  );
}
