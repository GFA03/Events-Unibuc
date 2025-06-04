'use client';

import { useUsers } from '@/features/user/hooks';
import WithLoader from '@/components/ui/common/WithLoader';
import UserCard from '@/components/users/UserCard';

export default function AdminPage() {
  const { data: users, isLoading, isError } = useUsers();

  if (!users) {
    return <p>Users not found!</p>;
  }

  return (
    <WithLoader isLoading={isLoading} isError={isError} errorMessage="Failed to load users">
      <div className="flex flex-col min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Admin Page</h1>
        <div className="flex flex-col gap-4">
          {users.map((user) => {
            return <UserCard key={user.id} user={user} />;
          })}
        </div>
      </div>
    </WithLoader>
  );
}
