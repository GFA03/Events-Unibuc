import { Event } from '@/features/event/model';
import React, { Dispatch } from 'react';
import ImageSection from './ImageSection';
import ContentSection from './ContentSection';

export default function EventHeader({
  event,
  setIsEditModalOpen
}: {
  event: Event;
  setIsEditModalOpen: Dispatch<React.SetStateAction<boolean>>;
}) {
  if (!event) {
    return null;
  }

  const { name, imageUrl } = event;

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-lg">
          <div className="flex flex-col lg:flex-row">
            <ImageSection name={name} imageUrl={imageUrl} />
            <ContentSection setIsEditModalOpen={setIsEditModalOpen} />
          </div>
        </div>
      </div>
    </div>
  );
}
