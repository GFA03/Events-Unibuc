// hooks/useEmailVerification.ts
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { authService } from '@/features/auth/service';

export interface VerificationState {
  status: 'success' | 'loading' | 'error' | 'expired-token';
  message: string;
}

export function useEmailVerification() {
  const [verificationState, setVerificationState] = useState<VerificationState>({
    status: 'loading',
    message: 'Verifying email...'
  });
  const [email, setEmail] = useState('');
  const [showResendForm, setShowResendForm] = useState(false);

  const verifyMutation = useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onSuccess: (data) => {
      setVerificationState({
        status: 'success',
        message: data.message || 'Email successfully verified!'
      });
    },
    onError: (error: unknown) => {
      let errMessage = 'Something went wrong while verifying your email.';
      let status: 'error' | 'expired-token' = 'error';

      if (error instanceof AxiosError) {
        const backendMessage = error.response?.data?.message;
        if (typeof backendMessage === 'string') {
          errMessage = backendMessage;
          if (backendMessage.toLowerCase().includes('expired')) {
            status = 'expired-token';
            setShowResendForm(true);
          }
        }
      } else if (error instanceof Error) {
        if (error.message.toLowerCase().includes('expired')) {
          status = 'expired-token';
          errMessage = 'The verification link is expired.';
          setShowResendForm(true);
        }
      }

      setVerificationState({ status, message: errMessage });
    }
  });

  const resendMutation = useMutation({
    mutationFn: authService.resendVerificationEmail,
    onSuccess: (data) => {
      setVerificationState({
        status: 'success',
        message: data.message || 'Verification email sent!'
      });
      setShowResendForm(false);
    },
    onError: (error: Error) => {
      setVerificationState({
        status: 'error',
        message: error.message
      });
    }
  });

  const handleResendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      resendMutation.mutate(email.trim());
    }
  };

  return {
    verificationState,
    setVerificationState,
    verifyMutation,
    resendMutation,
    email,
    setEmail,
    showResendForm,
    setShowResendForm,
    handleResendEmail
  };
}
