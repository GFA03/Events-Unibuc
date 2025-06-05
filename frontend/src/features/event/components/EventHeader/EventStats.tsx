import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faPerson } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import React from 'react';
import { useEventRegistrations } from '@/features/registration/hooks';
import { useParams } from 'next/navigation';

export default function EventStats({
  noParticipants,
  startDateTime
}: {
  noParticipants: number | null;
  startDateTime: Date;
}) {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const { data: participantsCount } = useEventRegistrations(id);

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faPerson} className="text-white text-sm" />
          </div>

          <div>
            <p className="text-sm text-gray-600">Participants</p>
            <p className="font-bold text-indigo-700">
              {participantsCount}
              {noParticipants && `/${noParticipants}`}
            </p>
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
