
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

export type SystemCheckStatus = 'checking' | 'success' | 'error' | 'warning';

export interface SystemCheckItemProps {
  title: string;
  description: string;
  status: SystemCheckStatus;
  errorMessage?: string;
}

const SystemCheckItem = ({
  title,
  description,
  status,
  errorMessage
}: SystemCheckItemProps) => {
  const getIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
    }
  };

  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg border bg-white">
      <div className="mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
        {status === 'error' && errorMessage && (
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default SystemCheckItem;
