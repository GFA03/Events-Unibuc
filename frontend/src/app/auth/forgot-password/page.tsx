'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '@/features/auth/service';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' })
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { register, handleSubmit, reset } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await authService.forgotPassword(data.email);
      // Simulate API call to send reset password email
      console.log('Sending reset password email to:', data.email);
      // Reset form after successful submission
      reset();
      alert('Reset password link sent to your email.');
    } catch (error) {
      console.error('Error sending reset password email:', error);
      alert('Failed to send reset password email. Please try again later.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center">
      <div className="max-w-md w-full bg-cyan-600 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl text-white font-bold mb-4">Forgot Password</h1>
        <p className="mb-6 text-gray-200">
          Please enter your email address to reset your password.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
          <input
            type="email"
            placeholder="Email Address"
            {...register('email')}
            className="w-full p-2 mb-4 border bg-white border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
