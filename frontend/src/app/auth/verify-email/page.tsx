'use client';

import { useEffect } from 'react';
import { ArrowRight, CheckCircle, Mail, RefreshCw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEmailVerification } from '@/features/auth/hooks/useEmailVerification';
import { getStatusColor, getStatusIcon } from '@/features/auth/utils/emailVerificationUI';
import LoadingSpinner from '@/components/ui/common/LoadingSpinner';
import VerificationFailed from '@/features/auth/components/verify-email/VerificationFailed';
import Footer from '@/features/auth/components/verify-email/Footer';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const {
    verificationState,
    setVerificationState,
    verifyMutation,
    resendMutation,
    email,
    setEmail,
    showResendForm,
    setShowResendForm,
    handleResendEmail
  } = useEmailVerification(token);

  useEffect(() => {
    if (!token) {
      setVerificationState({
        status: 'expired-token',
        message: 'No verification token provided'
      });
      return;
    }
    verifyMutation.mutate(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              {getStatusIcon(verificationState.status)}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Verification</h1>

            <p className={`text-md ${getStatusColor(verificationState.status)} mb-6`}>
              {verificationState.message}
            </p>
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
              <VerificationFailed message={verificationState.message} />
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
          {verificationState.status === 'loading' && <LoadingSpinner />}

          <Footer />
        </div>
      </div>
    </main>
  );
}
