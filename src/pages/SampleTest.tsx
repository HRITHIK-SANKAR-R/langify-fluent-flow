
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const SampleTest = () => {
  const navigate = useNavigate();
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSentence, setShowSentence] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Create audio element
    const audioElement = new Audio("/sample-audio.mp3");
    setAudio(audioElement);
    
    // Clean up on unmount
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = "";
      }
    };
  }, []);
  
  useEffect(() => {
    let timer: number;
    
    if (isPlaying && timeRemaining > 0) {
      timer = window.setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, timeRemaining]);
  
  const handlePlayAudio = () => {
    if (!audio) return;
    
    setIsLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
      setIsPlaying(true);
      
      audio.play().catch(error => {
        console.error("Error playing audio:", error);
        toast.error("Failed to play audio. Please try again.");
      });
      
      audio.onended = () => {
        setIsPlaying(false);
        setAudioPlayed(true);
        setShowSentence(true);
      };
    }, 800);
  };
  
  const handleSkip = () => {
    navigate("/test-overview");
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">Sample Test</h1>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.location.reload()}
              className="text-gray-500"
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Reset
            </Button>
          </div>
          <p className="text-gray-600 mb-8">
            This is a sample test to help you get familiar with the format.
          </p>
          
          <div className="border rounded-lg p-6 bg-white mb-8">
            <h2 className="text-xl font-semibold mb-4 text-center">Reading Test</h2>
            <p className="text-center mb-6">
              You will hear a sentence. After the audio plays, read the sentence aloud.
            </p>
            
            {!audioPlayed ? (
              <div className="flex justify-center mb-6">
                <Button
                  onClick={handlePlayAudio}
                  disabled={isLoading || isPlaying}
                  className="bg-blue-500 hover:bg-blue-600"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Play Audio
                    </>
                  )}
                </Button>
              </div>
            ) : null}
            
            {isPlaying && (
              <div className="flex items-center justify-center mb-6">
                <div className="animate-pulse flex space-x-1">
                  <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                  <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                  <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                </div>
                <span className="ml-3">Playing audio... {timeRemaining}s</span>
              </div>
            )}
            
            {showSentence && (
              <div className="mb-6 bg-blue-50 p-6 rounded-lg text-center animate-fade-in">
                <p className="text-lg font-medium">
                  "The weather today is perfect for a walk in the park."
                </p>
                <p className="mt-4 text-gray-600">
                  Please read the sentence aloud.
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={handleSkip}
              variant="secondary"
              size="sm"
            >
              Skip Sample
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SampleTest;
