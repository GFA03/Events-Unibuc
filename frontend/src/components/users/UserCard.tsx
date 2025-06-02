import EditUserModal from './EditUserModal';
import { Role } from '@/types/user/roles';
import { useState } from 'react';
import { User } from '@/models/user/User';
import { userService } from '@/services/userService';
import toast from 'react-hot-toast';

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleDeleteClick = async () => {
    if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      try {
        await userService.deleteUser(user.id);
        toast.success(`User deleted successfully.`);
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error(`Failed to delete user! Please try again later.`);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return 'bg-red-100 text-red-800';
      case Role.ORGANIZER:
        return 'bg-yellow-100 text-yellow-800';
      case Role.USER:
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-gray-600 mb-2">{user.email}</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
              {Role[user.role]}
            </span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleEditClick}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Edit User">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>

            <button
              onClick={handleDeleteClick}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete User">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500 space-y-1">
          <p>ID: {user.id}</p>
          <p>Created: {formatDate(user.createdAt)}</p>
          <p>Updated: {formatDate(user.updatedAt)}</p>
        </div>
      </div>

      <EditUserModal user={user} isOpen={isEditModalOpen} onClose={handleCloseModal} />
    </>
  );
}
