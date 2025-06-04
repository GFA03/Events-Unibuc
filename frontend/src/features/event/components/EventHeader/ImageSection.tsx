import Image from 'next/image';
import React from 'react';

export default function ImageSection({ name, imageUrl }: { name: string; imageUrl: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  console.log(baseUrl);

  return (
    <div className="lg:w-1/2 relative">
      <Image
        src={imageUrl ? `${baseUrl}${imageUrl}` : '/unibuc-event-logo.png'}
        alt={name}
        width={600}
        height={400}
        className="object-cover lg:object-contain w-full h-64 lg:h-full"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
    </div>
  );
}
