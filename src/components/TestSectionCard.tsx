
import { 
  Book, Repeat, HelpCircle, Layers, FileText, 
  MessageCircle, BookOpen, LucideIcon 
} from "lucide-react";

type IconType = "book" | "repeat" | "help" | "layers" | "file-text" | "message-circle" | "book-open";

interface TestSectionCardProps {
  title: string;
  description: string;
  questions: number;
  timePerQuestion: string;
  extraInfo?: string;
  icon: IconType;
}

const TestSectionCard = ({ 
  title, 
  description, 
  questions, 
  timePerQuestion,
  extraInfo,
  icon
}: TestSectionCardProps) => {
  
  const getIcon = () => {
    switch (icon) {
      case "book":
        return <Book className="w-5 h-5 text-blue-500" />;
      case "repeat":
        return <Repeat className="w-5 h-5 text-blue-500" />;
      case "help":
        return <HelpCircle className="w-5 h-5 text-blue-500" />;
      case "layers":
        return <Layers className="w-5 h-5 text-blue-500" />;
      case "file-text":
        return <FileText className="w-5 h-5 text-blue-500" />;
      case "message-circle":
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case "book-open":
        return <BookOpen className="w-5 h-5 text-blue-500" />;
    }
  };
  
  return (
    <div className="border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center mb-3">
        <div className="bg-blue-50 p-2 rounded-full mr-3">
          {getIcon()}
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      
      <div className="flex justify-between text-sm text-gray-500">
        <div>
          {questions} questions
        </div>
        <div>
          {extraInfo || `${timePerQuestion} per question`}
        </div>
      </div>
    </div>
  );
};

export default TestSectionCard;
