import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function ManagementButtons({
  canManageEvent,
  setIsEditModalOpen,
  handleDelete
}: {
  canManageEvent: boolean;
  setIsEditModalOpen: (isOpen: boolean) => void;
  handleDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    canManageEvent && (
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsEditModalOpen(true);
          }}
          className="w-10 h-10 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-all duration-200 hover:scale-110 flex items-center justify-center group">
          <FontAwesomeIcon icon={faPenToSquare} className="text-sm group-hover:animate-pulse" />
        </button>
        <button
          onClick={handleDelete}
          className="w-10 h-10 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-all duration-200 hover:scale-110 flex items-center justify-center group">
          <FontAwesomeIcon icon={faTrash} className="text-sm group-hover:animate-pulse" />
        </button>
      </div>
    )
  );
}
