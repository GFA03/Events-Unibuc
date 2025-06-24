import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { userService } from '@/features/user/service';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileDeleteAccountSection() {
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (!confirmed) return;

    const doubleConfirmed = confirm(
      'This will permanently delete all your data. Are you absolutely sure?'
    );

    if (!doubleConfirmed) return;

    setLoading(true);

    try {
      await userService.deleteCurrentUser();
      toast.success('Account deleted successfully');
      logout();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error deleting account:', error.response?.data);
        toast.error(error.response?.data.message || 'An error occurred while deleting account');
      } else {
        console.error('Error deleting account:', error);
        alert('An error occurred while deleting account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t pt-8">
      <h2 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
        <FontAwesomeIcon icon={faTrash} className="mr-2" />
        Danger Zone
      </h2>
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-sm text-red-700 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={loading}
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {loading ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
    </div>
  );
}
