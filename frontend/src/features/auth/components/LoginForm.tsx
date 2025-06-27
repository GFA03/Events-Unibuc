'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; // Use Zod for schema validation
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/common/Button';
import { Input } from '@/components/ui/common/Input';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

// Define schema with Zod
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' })
});

type LoginFormInputs = z.infer<typeof loginSchema>; // Infer type from schema

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema) // Use Zod resolver
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setError(null); // Clear previous errors
    try {
      await login(data);
      toast.success('Login successful!');
      // Redirect handled by AuthContext
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data.message || 'An unknown error occurred.');
        toast.error(err.response?.data.message || 'Login failed.');
      } else {
        // TODO: Handle other error types if needed
        setError(err?.message || 'An unexpected error occurred. Please try again later.');
      }
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
      <div>
        <Button type="submit" disabled={isLoading} className="w-full">
          Log in
        </Button>
      </div>
    </form>
  );
}
