'use client';

import { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  Mail,
  RefreshCw,
  XCircle
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/features/auth/service';
import { AxiosError } from 'axios';

interface VerificationState {
  status: 'success' | 'loading' | 'error' | 'expired-token';
  message: string;
}

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [verificationState, setVerificationState] = useState<VerificationState>({
    status: 'loading',
    message: 'Verifying email...'
  });
  const [email, setEmail] = useState('');
  const [showResendForm, setShowResendForm] = useState(false);

  // Email verification mutation
  const verifyMutation = useMutation({
    mutationFn: authService.verifyEmail,
    onSuccess: (data) => {
      setVerificationState({
        status: 'success',
        message: data.message || 'Email successfully verified!'
      });
    },
    onError: (error: unknown) => {
      let errMessage = 'Something went wrong while verifying your email.';
      let status: 'error' | 'expired-token' = 'error';
      const isAxios = error instanceof AxiosError;

      if (isAxios) {
        const backendMessage = error.response?.data?.message;

        if (typeof backendMessage === 'string') {
          errMessage = backendMessage;

          const messageLower = backendMessage.toLowerCase();
          const isTokenExpired = messageLower.includes('expired');

          if (isTokenExpired) {
            status = 'expired-token';
            setShowResendForm(true);
          }
        } else if (error.response?.status === 400) {
          errMessage =
            'The verification request was expired. Please try again or request a new link.';
        } else if (error.response?.status === 500) {
          errMessage = 'A server error occurred. Please try again later.';
        }
      } else if (error instanceof Error) {
        // Fallback for non-Axios errors
        if (error.message.toLowerCase().includes('expired')) {
          status = 'expired-token';
          errMessage = 'The verification link is expired or expired.';
          setShowResendForm(true);
        }
      }

      setVerificationState({
        status,
        message: errMessage
      });
    }
  });

  // Resend verification mutation
  const resendMutation = useMutation({
    mutationFn: authService.resendVerificationEmail,
    onSuccess: (data) => {
      setVerificationState({
        status: 'success',
        message: data.message || 'Verification email sent! Please check your inbox.'
      });
      setShowResendForm(false);
    },
    onError: (error: Error) => {
      console.log(error);
      setVerificationState({
        status: 'error',
        message: error.message
      });
    }
  });

  // Verify email on component mount
  useEffect(() => {
    if (!token) {
      setVerificationState({
        status: 'expired-token',
        message: 'No verification token provided'
      });
      return;
    }

    // Call verification only once
    verifyMutation.mutate(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty dependency ensures this runs only once on mount

  const handleResendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      resendMutation.mutate(email.trim());
    }
  };

  const getStatusIcon = () => {
    switch (verificationState.status) {
      case 'loading':
        return <Clock className="w-16 h-16 text-blue-500 animate-pulse" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'error':
      case 'expired-token':
        return <XCircle className="w-16 h-16 text-red-500" />;
      default:
        return <AlertCircle className="w-16 h-16 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (verificationState.status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
      case 'expired-token':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">{getStatusIcon()}</div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Verification</h1>

            <p className={`text-md ${getStatusColor()} mb-6`}>{verificationState.message}</p>
          </div>

          {/* Success State */}
          {verificationState.status === 'success' && !showResendForm && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-green-800 font-medium">Your account is now active!</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/auth/login')}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                Continue to Login
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}

          {/* Error State with Resend Option */}
          {(verificationState.status === 'expired-token' ||
            verificationState.status === 'error') && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <XCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-red-800 font-medium block">Verification Failed</span>
                    <span className="text-red-700 text-sm mt-1 block">
                      {verificationState.message}
                    </span>
                  </div>
                </div>
              </div>

              {!showResendForm && (
                <button
                  onClick={() => setShowResendForm(true)}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                  <Mail className="w-4 h-4 mr-2" />
                  Request New Verification Email
                </button>
              )}
            </div>
          )}

          {/* Resend Form */}
          {showResendForm && (
            <form onSubmit={handleResendEmail} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="your-email@example.com"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={resendMutation.isPending}
                  className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                  {resendMutation.isPending ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4 mr-2" />
                  )}
                  {resendMutation.isPending ? 'Sending...' : 'Send Email'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowResendForm(false)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Loading State */}
          {verificationState.status === 'loading' && (
            <div className="text-center">
              <div className="inline-flex items-center text-blue-600">
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                <span className="text-sm font-medium">Processing verification...</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              Need help?{' '}
              <a
                href="/support"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
