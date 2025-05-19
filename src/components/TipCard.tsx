
import { Volume2, Mic, Clock, User, Shield, BookOpen } from "lucide-react";

type IconType = "volume" | "mic" | "clock" | "user" | "shield" | "book";

interface TipCardProps {
  icon: IconType;
  title: string;
  description: string;
}

const TipCard = ({ icon, title, description }: TipCardProps) => {
  const getIcon = () => {
    switch (icon) {
      case "volume":
        return <Volume2 className="w-5 h-5 text-blue-500" />;
      case "mic":
        return <Mic className="w-5 h-5 text-blue-500" />;
      case "clock":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "user":
        return <User className="w-5 h-5 text-blue-500" />;
      case "shield":
        return <Shield className="w-5 h-5 text-blue-500" />;
      case "book":
        return <BookOpen className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start">
        <div className="mr-3 mt-1">
          {getIcon()}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default TipCard;
