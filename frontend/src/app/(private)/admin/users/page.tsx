'use client';

import WithLoader from '@/components/ui/common/WithLoader';
import UserCard from '@/components/users/UserCard';
import { useUsers } from '@/features/user/hooks';
import { User } from '@/features/user/model';
import { userService } from '@/features/user/service';
import { Role } from '@/features/user/types/roles';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Pagination } from '@/components/ui/common/Pagination';
import EditUserModal from '@/features/user/components/EditUserModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUsers, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { AxiosError } from 'axios';


export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const queryParams = {
    limit: 10,
    offset: 0,
    ...(searchTerm && { search: searchTerm.trim() })
  };

  const [user, setUser] = useState<User | null>(null);

  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<User>>({
    firstName: '',
    lastName: '',
    email: '',
    role: Role.User // default
  });

  const handleEditClick = (selectedUser: User) => {
    setUser(selectedUser);
    setFormData({
      firstName: selectedUser.firstName,
      lastName: selectedUser.lastName,
      email: selectedUser.email,
      role: selectedUser.role
    });
    setIsEditModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    try {
      await userService.updateUser(user.id, formData);
      toast.success('User updated successfully!');
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error('Error updating user.', err?.response?.data?.message);
      }
      toast.error('Failed to update user.');
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const { data: data, isLoading, isError } = useUsers(queryParams);

  const [page, setPage] = useState(0); // Assuming page is always 0 for initial load, can be modified for pagination

  const users = data?.users || [];
  const totalCount = data?.total || 0;
  const isLastPage = queryParams.offset + queryParams.limit >= totalCount;
  const totalPages = Math.ceil(totalCount / queryParams.limit);
  const currentPage = page + 1;

  if (!users) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faUsers} className="text-6xl text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">Users not found!</p>
        </div>
      </div>
    );
  }

  return (
    <WithLoader isLoading={isLoading} isError={isError} errorMessage="Failed to load users">
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6 md:py-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faUserShield}
                    className="text-3xl md:text-4xl text-cyan-600 mr-3"
                  />
                  <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
                      Admin Dashboard
                    </h1>
                    <p className="text-sm md:text-base text-gray-600 mt-1">
                      Manage users and system settings
                    </p>
                  </div>
                </div>

                {/* Stats Card */}
                <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faUsers} className="text-cyan-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-cyan-800">Total Users</p>
                      <p className="text-2xl font-bold text-cyan-900">{totalCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {/* Search Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 max-w-md">
                <label
                  htmlFor="user-search"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Search Users
                </label>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
                    <div className="relative flex-1">
                      <FontAwesomeIcon
                        icon={faSearch}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        id="user-search"
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            setSearchTerm(inputValue.trim());
                            setPage(0);
                          }
                        }}
                        placeholder="Search by email or name..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <button
                      onClick={() => {
                        setSearchTerm(inputValue.trim());
                        setPage(0);
                      }}
                      className="mt-3 sm:mt-0 sm:ml-4 px-4 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-200">
                      Search
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <span className="bg-gray-100 px-3 py-1 rounded-full">
                  {users.length} {users.length === 1 ? 'user' : 'users'} found
                </span>
              </div>
            </div>
          </div>

          {/* Users Grid */}
          {users.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">User Management</h2>

              {/* Desktop/Tablet Grid */}
              <div className="hidden sm:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="transform transition-all duration-200 hover:scale-105">
                    <UserCard user={user} onEdit={handleEditClick} />
                  </div>
                ))}
              </div>

              {/* Mobile Stack */}
              <div className="sm:hidden space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="transform transition-all duration-200">
                    <UserCard user={user} onEdit={handleEditClick} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* No Results State */
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12 text-center">
              <FontAwesomeIcon
                icon={faSearch}
                className="text-4xl md:text-6xl text-gray-300 mb-4"
              />
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? `No users match "${searchTerm}". Try a different search term.`
                  : 'There are no users to display.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-200">
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bottom Spacing */}
        <div className="pb-8"></div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          isLastPage={isLastPage}
          onPageChange={(newPage) => setPage(newPage - 1)}
          isLoading={isLoading}
        />
      </div>
      {user && (
        <EditUserModal
          user={user}
          isOpen={isEditModalOpen}
          formData={formData}
          onClose={handleCloseModal}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
        />
      )}
    </WithLoader>
  )
}