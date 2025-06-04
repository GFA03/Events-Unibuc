'use client';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cyan-700">
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
