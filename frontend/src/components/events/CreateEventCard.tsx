import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import CreateEventModal from './CreateEventModal';

export default function CreateEventCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-slate-50 rounded-2xl shadow-lg flex flex-col items-center justify-center h-full min-h-[300px] cursor-pointer transition-transform duration-200 hover:scale-105">
        <FontAwesomeIcon icon={faPlus} className="text-4xl text-gray-400" />
        <p className="mt-4 text-gray-500">Create New Event</p>
      </div>
      <CreateEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
} 