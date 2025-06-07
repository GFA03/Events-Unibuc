'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/common/Input';
import { Button } from '@/components/ui/common/Button';
import { AxiosError } from 'axios';

const signupSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string(),
    firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
    lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
    phoneNumber: z.string().min(10, { message: 'Phone number must be at least 10 characters' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

type SignupFormInputs = z.infer<typeof signupSchema>;

export function SignupForm() {
  const { signup, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit: SubmitHandler<SignupFormInputs> = async ({
                                                             // eslint-disable-next-line @typescript-eslint/no-unused-vars
    confirmPassword, // exclude from signup
    ...data
  }) => {
    setError(null);
    try {
      await signup(data);
      toast.success('Signup successful!');
      // Redirect handled by AuthContext
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err?.message || 'An unknown error occurred.');
        toast.error(err?.message || 'buttonSignup failed.');
      }
      setError('An unknown error occurred.');
      toast.error('buttonSignup failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <Input
        id="email"
        label="Email Address"
        type="email"
        register={register}
        error={errors.email?.message}
        disabled={isLoading}
      />
      <Input
        id="password"
        label="Password"
        type="password"
        register={register}
        error={errors.password?.message}
        disabled={isLoading}
      />
      <Input
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        register={register}
        error={errors.confirmPassword?.message}
        disabled={isLoading}
      />
      <Input
        id="firstName"
        label="First Name"
        type="text"
        register={register}
        error={errors.firstName?.message}
        disabled={isLoading}
      />
      <Input
        id="lastName"
        label="Last Name"
        type="text"
        register={register}
        error={errors.lastName?.message}
        disabled={isLoading}
      />
      <Input
        id="phoneNumber"
        label="Phone Number"
        type="tel"
        register={register}
        error={errors.phoneNumber?.message}
        disabled={isLoading}
      />
      <div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </div>
    </form>
  );
}
