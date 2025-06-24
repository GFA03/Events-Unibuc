import React, { useState } from 'react';
import { Input } from '@/components/ui/common/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { PasswordChangeFormData } from '@/components/users/ProfilePasswordChangeForm';

interface PasswordInputProps {
  id: keyof PasswordChangeFormData;
  label: string;
  register: any;
  error?: string;
  placeholder: string;
  disabled?: boolean;
  showToggle?: boolean;
}

export default function PasswordInput({
  id,
  label,
  register,
  error,
  placeholder,
  disabled = false,
  showToggle = false
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  if (!showToggle) {
    return (
      <Input
        id={id}
        label={label}
        type="password"
        register={register}
        error={error}
        placeholder={placeholder}
        disabled={disabled}
      />
    );
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-black mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          {...register(id)}
          disabled={disabled}
          placeholder={placeholder}
          className={`block bg-white w-full text-black px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
            error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50">
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
