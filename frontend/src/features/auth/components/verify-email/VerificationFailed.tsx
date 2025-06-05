import { XCircle } from 'lucide-react';

export default function VerificationFailed({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start">
        <XCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
        <div>
          <span className="text-red-800 font-medium block">Verification Failed</span>
          <span className="text-red-700 text-sm mt-1 block">{message}</span>
        </div>
      </div>
    </div>
  );
}
