
import { Check, Loader2, X, Globe, Cookie, Wifi, Volume2, Mic, Activity } from "lucide-react";

type SystemCheckStatus = "idle" | "checking" | "success" | "error";
type IconType = "globe" | "cookie" | "wifi" | "volume" | "mic" | "activity";

interface SystemCheckItemProps {
  label: string;
  status: SystemCheckStatus;
  icon: IconType;
}

const SystemCheckItem = ({ label, status, icon }: SystemCheckItemProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case "idle":
        return <div className="w-5 h-5" />;
      case "checking":
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      case "success":
        return <Check className="w-5 h-5 text-green-500" />;
      case "error":
        return <X className="w-5 h-5 text-red-500" />;
    }
  };

  const getIcon = () => {
    switch (icon) {
      case "globe":
        return <Globe className="w-6 h-6 text-green-500" />;
      case "cookie":
        return <Cookie className="w-6 h-6 text-green-500" />;
      case "wifi":
        return <Wifi className="w-6 h-6 text-green-500" />;
      case "volume":
        return <Volume2 className="w-6 h-6 text-green-500" />;
      case "mic":
        return <Mic className="w-6 h-6 text-green-500" />;
      case "activity":
        return <Activity className="w-6 h-6 text-green-500" />;
    }
  };

  return (
    <div className={`flex items-center p-4 ${status === 'checking' ? 'bg-blue-50' : ''} rounded-md transition-colors`}>
      <div className="bg-white p-2 rounded-full mr-4 shadow-sm">
        {getIcon()}
      </div>
      <span className="flex-1 text-gray-700">{label}</span>
      <div>{getStatusIcon()}</div>
    </div>
  );
};

export default SystemCheckItem;
