
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface WelcomeCardProps {
  onStartTest: () => void;
  isStarting: boolean;
}

const WelcomeCard = ({ onStartTest, isStarting }: WelcomeCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to <span className="text-blue-500">Langify</span> <span className="text-gray-800">Assessment</span> <span className="text-blue-500">Test</span>
      </h1>
      
      <div className="my-10">
        <img 
          src="/placeholder.svg" 
          alt="Langify Test" 
          className="h-40 mx-auto animate-pulse" 
        />
      </div>

      <p className="text-gray-600 max-w-lg mx-auto mb-8">
        Please ensure your headphones and microphone are connected
        and close to your mouth.
      </p>
      
      <Button 
        onClick={onStartTest} 
        disabled={isStarting}
        size="lg" 
        className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-6 text-lg rounded-md transition-all w-64"
      >
        {isStarting ? "Starting..." : "Proceed"}
        {!isStarting && <ArrowRight className="ml-2 h-5 w-5" />}
      </Button>
    </div>
  );
};

export default WelcomeCard;
