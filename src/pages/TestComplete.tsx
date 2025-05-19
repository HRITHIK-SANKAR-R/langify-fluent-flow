
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Download, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import confetti from "@/utils/confetti";
import { useEffect } from "react";

const TestComplete = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Trigger confetti effect when component mounts
    const timeoutId = setTimeout(() => {
      confetti();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardContent className="p-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <svg 
              className="w-10 h-10 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Test Complete!</h1>
          <p className="text-gray-600 mb-8">
            Thanks for completing the Langify English Test. Your recordings have been submitted successfully.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Download className="mr-2 h-4 w-4" />
              Download Results
            </Button>
            
            <Button variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Leave Feedback
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            className="text-gray-500"
            onClick={() => navigate("/")}
          >
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
          
          <p className="text-sm text-gray-500 mt-8">
            Your test results will be processed and available within 24-48 hours.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestComplete;
