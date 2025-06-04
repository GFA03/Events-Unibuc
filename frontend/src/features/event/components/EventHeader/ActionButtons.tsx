import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faTicket } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export default function ActionButtons({
  handleJoin,
  handleUnjoin,
  isRegistered
}: {
  handleJoin: () => void;
  handleUnjoin: () => void;
  isRegistered: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {isRegistered ? (
          <button
            onClick={handleUnjoin}
            className="px-8 py-4 bg-gradient-to-r from-red-500 to-amber-600 hover:from-red-600 hover:to-amber-700 text-white rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-xl font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon={faTicket} />
            Unjoin Event
          </button>
        ) : (
          <button
            onClick={handleJoin}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-xl font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon={faTicket} />
            Join Event
          </button>
        )}
      </div>

      <button className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 rounded-2xl transition-all duration-200 hover:scale-110 flex items-center justify-center">
        <FontAwesomeIcon icon={faShare} />
      </button>
    </div>
  );
}
