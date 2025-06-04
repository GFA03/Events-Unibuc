import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faPerson } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import React from 'react';

export default function EventStats({ startDateTime }: { startDateTime: Date }) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faPerson} className="text-white text-sm" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Participants</p>
            <p className="font-bold text-indigo-700">0/10</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faCalendar} className="text-white text-sm" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Next Session</p>
            <p className="font-bold text-green-700 text-sm">{format(startDateTime, 'MMM dd')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
