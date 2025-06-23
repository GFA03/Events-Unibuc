'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { authService } from '@/features/auth/service';
import { Input } from '@/components/ui/common/Input';
import { Button } from '@/components/ui/common/Button';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema)
  });

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }
    setToken(tokenFromUrl);
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('Invalid reset token. Please request a new password reset.');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await authService.resetPassword(token, data.password);
      setMessage(result.message || 'Password has been successfully reset!');
      reset();

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      setError(
        error?.response?.data?.message ||
          'Failed to reset password. Please try again or request a new reset link.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !error) {
    return (
      <div className="min-h-[calc(100vh-150px)] flex items-center justify-center">
        <div className="max-w-md w-full bg-cyan-600 p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="text-white mt-4">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center">
      <div className="max-w-md w-full bg-cyan-600 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl text-white font-bold mb-4">Reset Password</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
            <p className="text-sm mt-2">Redirecting to login page...</p>
          </div>
        )}

        {!message && (
          <>
            <p className="mb-6 text-gray-200">Please enter your new password below.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                id="password"
                label="New Password"
                type="password"
                register={register}
                error={errors.password?.message}
                placeholder="Enter your new password"
                disabled={isLoading}
              />

              <Input
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                register={register}
                error={errors.confirmPassword?.message}
                placeholder="Confirm your new password"
                disabled={isLoading}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="w-full">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-200 text-sm">
                Remember your password?{' '}
                <button
                  onClick={() => router.push('/auth/login')}
                  className="text-blue-200 hover:text-blue-100 underline hover:cursor-pointer">
                  Sign in here
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
