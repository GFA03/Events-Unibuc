import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { userService } from '@/features/user/service';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { z } from 'zod';
import { Input } from '@/components/ui/common/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PasswordInput from '../ui/common/PasswordInput';
import { Button } from '@/components/ui/common/Button';

const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'Current password is required' }),
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your new password' })
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match",
    path: ['confirmPassword']
  });

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

export default function ProfilePasswordChangeForm() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const newPassword = watch('newPassword');

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return { text: 'Very Weak', color: 'text-red-500' };
      case 2:
        return { text: 'Weak', color: 'text-orange-500' };
      case 3:
        return { text: 'Fair', color: 'text-yellow-500' };
      case 4:
        return { text: 'Good', color: 'text-blue-500' };
      case 5:
        return { text: 'Strong', color: 'text-green-500' };
      default:
        return { text: '', color: '' };
    }
  };

  const onSubmit = async (data: PasswordChangeFormData) => {
    setIsLoading(true);

    try {
      await userService.changePassword(data.currentPassword, data.newPassword);
      toast.success('Password changed successfully!');

      reset();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Error changing password:', error.response?.data);
        toast.error(error.response?.data.message || 'An error occurred while changing password');
      } else {
        console.error('Error changing password:', error);
        toast.error('An error occurred while changing password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(newPassword || '');
  const strengthInfo = getPasswordStrengthText(passwordStrength);

  return (
    <div className="mb-8 border-t pt-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <FontAwesomeIcon icon={faLock} className="mr-2 text-cyan-600" />
        Change Password
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="currentPassword"
          label="Current Password"
          type="password"
          register={register}
          error={errors.currentPassword?.message}
          placeholder="Enter your current password"
          disabled={isLoading}
        />

        <PasswordInput
          id="newPassword"
          label="New Password"
          register={register}
          error={errors.newPassword?.message}
          placeholder="Enter new password"
          disabled={isLoading}
          showToggle={true}
        />

        {/* Password Strength Indicator */}
        {newPassword && (
          <div className="mb-2">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Password Strength:</span>
              <span className={strengthInfo.color}>{strengthInfo.text}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  passwordStrength <= 1
                    ? 'bg-red-500'
                    : passwordStrength === 2
                      ? 'bg-orange-500'
                      : passwordStrength === 3
                        ? 'bg-yellow-500'
                        : passwordStrength === 4
                          ? 'bg-blue-500'
                          : 'bg-green-500'
                }`}
                style={{ width: `${(passwordStrength / 5) * 100}%` }}></div>
            </div>
          </div>
        )}

        <PasswordInput
          id="confirmPassword"
          label="Confirm New Password"
          register={register}
          error={errors.confirmPassword?.message}
          placeholder="Confirm new password"
          disabled={isLoading}
          showToggle={true}
        />

        <div className="flex space-x-4 pt-4">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading || !isDirty}
            className="flex-1">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Changing Password...
              </>
            ) : (
              'Change Password'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
