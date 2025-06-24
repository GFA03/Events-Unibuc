import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/features/user/service';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/common/Input';
import { Button } from '@/components/ui/common/Button';

const profilePersonalInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First name is required' })
    .min(2, { message: 'First name must be at least 2 characters' })
    .max(50, { message: 'First name must be less than 50 characters' })
    .regex(/^[a-zA-Z\s-']+$/, {
      message: 'First name can only contain letters, spaces, hyphens, and apostrophes'
    }),
  lastName: z
    .string()
    .min(1, { message: 'Last name is required' })
    .min(2, { message: 'Last name must be at least 2 characters' })
    .max(50, { message: 'Last name must be less than 50 characters' })
    .regex(/^[a-zA-Z\s-']+$/, {
      message: 'Last name can only contain letters, spaces, hyphens, and apostrophes'
    }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' })
    .max(100, { message: 'Email must be less than 100 characters' })
});

export type ProfilePersonalInfoFormData = z.infer<typeof profilePersonalInfoSchema>;

export default function ProfilePersonalInfoForm() {
  const { user, checkAuthStatus } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue
  } = useForm<ProfilePersonalInfoFormData>({
    resolver: zodResolver(profilePersonalInfoSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: ''
    }
  });

  // Initialize form with user data when user is loaded
  useEffect(() => {
    if (user) {
      setValue('firstName', user.firstName || '');
      setValue('lastName', user.lastName || '');
      setValue('email', user.email || '');
    }
  }, [user, setValue]);

  const onSubmit = async (data: ProfilePersonalInfoFormData) => {
    setIsLoading(true);

    try {
      await userService.changePersonalInfo(data.firstName, data.lastName, data.email);
      toast.success('Profile updated successfully!');
      // Update the user context with new data
      await checkAuthStatus();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error updating profile:', error.response?.data);
        toast.error(error.response?.data.message || 'An error occurred while updating profile');
      } else {
        console.error('Error updating profile:', error);
        toast.error('An error occurred while updating profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="firstName"
          label="First Name"
          type="text"
          register={register}
          error={errors.firstName?.message}
          placeholder="Enter your first name"
          disabled={isLoading}
        />

        <Input
          id="lastName"
          label="Last Name"
          type="text"
          register={register}
          error={errors.lastName?.message}
          placeholder="Enter your last name"
          disabled={isLoading}
        />

        <Input
          id="email"
          label="Email Address"
          type="email"
          register={register}
          error={errors.email?.message}
          placeholder="Enter your email address"
          disabled={isLoading}
        />

        <div className="flex space-x-4">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading || !isDirty}
            className="flex-1">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              'Update Profile'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
