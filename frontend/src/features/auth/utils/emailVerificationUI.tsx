// utils/emailVerificationUI.tsx
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export function getStatusIcon(status: string) {
  switch (status) {
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
}

export function getStatusColor(status: string) {
  switch (status) {
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
}
