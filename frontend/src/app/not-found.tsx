import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-gray-100">
      <p className="mt-4 text-xl text-gray-600">Page Not Found</p>
      <Link href="/" className="mt-6 text-blue-500 hover:underline">
        Go back to Home
      </Link>
    </div>
  );
}
