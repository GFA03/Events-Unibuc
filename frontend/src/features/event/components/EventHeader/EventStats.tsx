import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useEventRegistrations } from '@/features/registration/hooks';
import { useParams } from 'next/navigation';

export default function EventStats({
  noParticipants,
}: {
  noParticipants: number | null;
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

    </div>
  );
}
