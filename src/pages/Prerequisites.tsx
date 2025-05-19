
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SystemCheckItem from "@/components/SystemCheckItem";
import { toast } from "@/components/ui/sonner";
import { ArrowRight } from "lucide-react";

const Prerequisites = () => {
  const navigate = useNavigate();
  const [checkResults, setCheckResults] = useState({
    browser: "checking",
    cookies: "checking",
    internet: "checking",
    volume: "checking",
    microphone: "checking",
    noise: "checking",
  });
  
  const [currentCheck, setCurrentCheck] = useState(0);
  const totalChecks = Object.keys(checkResults).length;
  
  useEffect(() => {
    const runChecks = async () => {
      // Simulate browser check
      setCheckResults(prev => ({ ...prev, browser: "checking" }));
      await sleep(800);
      setCheckResults(prev => ({ ...prev, browser: "success" }));
      setCurrentCheck(1);
      
      // Simulate cookies check
      setCheckResults(prev => ({ ...prev, cookies: "checking" }));
      await sleep(800);
      setCheckResults(prev => ({ ...prev, cookies: "success" }));
      setCurrentCheck(2);
      
      // Simulate internet check
      setCheckResults(prev => ({ ...prev, internet: "checking" }));
      await sleep(1500);
      setCheckResults(prev => ({ ...prev, internet: "success" }));
      setCurrentCheck(3);
      
      // Simulate volume check
      setCheckResults(prev => ({ ...prev, volume: "checking" }));
      await sleep(800);
      setCheckResults(prev => ({ ...prev, volume: "success" }));
      setCurrentCheck(4);
      
      // Simulate microphone check
      setCheckResults(prev => ({ ...prev, microphone: "checking" }));
      await sleep(1200);
      
      try {
        await requestMicrophoneAccess();
        setCheckResults(prev => ({ ...prev, microphone: "success" }));
      } catch (error) {
        setCheckResults(prev => ({ ...prev, microphone: "error" }));
        toast.error("Microphone access denied. Please allow microphone access to continue.");
        return;
      }
      
      setCurrentCheck(5);
      
      // Simulate noise level check
      setCheckResults(prev => ({ ...prev, noise: "checking" }));
      await sleep(1000);
      setCheckResults(prev => ({ ...prev, noise: "success" }));
    };
    
    runChecks();
  }, []);
  
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const requestMicrophoneAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (error) {
      console.error("Microphone access denied:", error);
      throw error;
    }
  };

  const allChecksSuccessful = Object.values(checkResults).every(result => result === "success");
  const hasError = Object.values(checkResults).some(result => result === "error");
  
  const handleContinue = () => {
    navigate("/tips");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold mb-8 text-center">System Check Results</h1>
          
          <div className="space-y-4">
            <SystemCheckItem 
              label="Checking browser compatibility" 
              status={checkResults.browser} 
              icon="globe"
            />
            
            <SystemCheckItem 
              label="Verifying cookies enabled" 
              status={checkResults.cookies}
              icon="cookie" 
            />
            
            <SystemCheckItem 
              label="Testing internet speed" 
              status={checkResults.internet}
              icon="wifi" 
            />
            
            <SystemCheckItem 
              label="Checking volume output" 
              status={checkResults.volume}
              icon="volume" 
            />
            
            <SystemCheckItem 
              label="Testing microphone access" 
              status={checkResults.microphone}
              icon="mic" 
            />
            
            <SystemCheckItem 
              label="Measuring background noise level" 
              status={checkResults.noise}
              icon="activity" 
            />
          </div>
          
          {allChecksSuccessful && (
            <div className="mt-8 flex justify-center">
              <Button 
                onClick={handleContinue}
                className="bg-blue-500 hover:bg-blue-600 transition-colors"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
          
          {hasError && (
            <div className="mt-8 text-center">
              <p className="text-red-500 mb-4">
                Please resolve the issues above before continuing.
              </p>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Retry Checks
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Prerequisites;
