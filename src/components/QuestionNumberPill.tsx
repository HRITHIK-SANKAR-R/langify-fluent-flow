
import { Check } from "lucide-react";

interface QuestionNumberPillProps {
  number: number;
  active?: boolean;
  complete?: boolean;
}

const QuestionNumberPill = ({ number, active = false, complete = false }: QuestionNumberPillProps) => {
  let bgColorClass = "bg-gray-100";
  let textColorClass = "text-gray-700";
  let borderClass = "";
  
  if (active) {
    bgColorClass = "bg-blue-100";
    textColorClass = "text-blue-700";
    borderClass = "border-2 border-blue-500";
  } else if (complete) {
    bgColorClass = "bg-green-100";
    textColorClass = "text-green-700";
  }
  
  return (
    <div 
      className={`
        ${bgColorClass} ${textColorClass} ${borderClass}
        rounded-full w-10 h-10 flex items-center justify-center 
        font-medium transition-all
      `}
    >
      {complete ? <Check className="h-4 w-4" /> : number}
    </div>
  );
};

export default QuestionNumberPill;
