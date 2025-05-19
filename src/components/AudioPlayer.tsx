
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface AudioPlayerProps {
  audioUrl: string;
  onPlaybackComplete?: () => void;
  autoPlay?: boolean;
  showControls?: boolean;
  maxReplayCount?: number;
}

const AudioPlayer = ({ 
  audioUrl, 
  onPlaybackComplete, 
  autoPlay = false,
  showControls = true,
  maxReplayCount = 2
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [replayCount, setReplayCount] = useState(maxReplayCount);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener('ended', handleAudioEnded);
      audioRef.current.addEventListener('error', handleAudioError);
    } else {
      audioRef.current.src = audioUrl;
    }
    
    // Reset state when audioUrl changes
    setIsPlaying(false);
    setHasPlayed(false);
    setReplayCount(maxReplayCount);
    
    // Auto play if specified
    if (autoPlay) {
      playAudio();
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', handleAudioEnded);
        audioRef.current.removeEventListener('error', handleAudioError);
      }
    };
  }, [audioUrl, autoPlay, maxReplayCount]);
  
  const handleAudioEnded = () => {
    setIsPlaying(false);
    setHasPlayed(true);
    
    if (onPlaybackComplete) {
      onPlaybackComplete();
    }
  };
  
  const handleAudioError = (error: any) => {
    console.error("Error playing audio:", error);
    toast.error("Failed to play audio. Please try again.");
    setIsPlaying(false);
    setIsLoading(false);
  };
  
  const playAudio = () => {
    if (!audioRef.current) return;
    
    setIsLoading(true);
    
    // Short loading simulation for better UX
    setTimeout(() => {
      if (audioRef.current) {
        setIsLoading(false);
        setIsPlaying(true);
        
        audioRef.current.play().catch(error => {
          handleAudioError(error);
        });
      }
    }, 500);
  };
  
  const pauseAudio = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setIsPlaying(false);
  };
  
  const replayAudio = () => {
    if (replayCount <= 0 || !audioRef.current) return;
    
    setReplayCount(prev => prev - 1);
    
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setIsPlaying(true);
      
      audioRef.current.play().catch(error => {
        handleAudioError(error);
      });
    }
  };
  
  if (!showControls && !isPlaying && !isLoading) {
    return null;
  }
  
  return (
    <div className="flex flex-col items-center">
      {!isPlaying && !hasPlayed ? (
        <Button
          onClick={playAudio}
          disabled={isLoading}
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
      ) : isPlaying ? (
        <div className="flex flex-col items-center">
          <div className="animate-pulse flex space-x-1 mb-4">
            <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
            <div className="h-4 w-3 bg-blue-500 rounded-full"></div>
            <div className="h-5 w-3 bg-blue-500 rounded-full"></div>
            <div className="h-4 w-3 bg-blue-500 rounded-full"></div>
            <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
          </div>
          
          {showControls && (
            <Button
              onClick={pauseAudio}
              variant="outline"
              size="sm"
            >
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </Button>
          )}
        </div>
      ) : hasPlayed && replayCount > 0 && showControls ? (
        <Button
          onClick={replayAudio}
          variant="outline"
          size="sm"
          className="text-blue-500 border-blue-300"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Replay Audio ({replayCount} left)
        </Button>
      ) : null}
    </div>
  );
};

export default AudioPlayer;
