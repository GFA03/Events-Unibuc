import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full bg-blue-300">
      <Image
        src="/hero-bg.jpg"
        alt="Students socializing"
        layout="fill"
        objectFit="cover"
        className="opacity-80"
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">
          The place where you can make friends
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-gray-100">
          University of Bucharest is here to help you socialize
        </p>
        <Link
          href="/events"
          className="mt-8 inline-block bg-white text-indigo-700 font-semibold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-transform">
          See all events
        </Link>
      </div>
    </section>
  );
}
