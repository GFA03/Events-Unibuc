import React from 'react';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form';

interface InputProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  id: Path<T>; // Use Path for type safety with register
  label: string;
  register: UseFormRegister<T>;
  error?: string;
}

export function Input<T extends FieldValues>({
  id,
  label,
  type = 'text',
  register,
  error,
  ...props
}: InputProps<T>) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-white mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        {...register(id)} // Register the input with react-hook-form
        className={`block bg-white w-full text-black px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
