
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { saveRecording } from "@/services/apiService";

interface AudioRecorderProps {
  questionId: string;
  timeLimit: number;
  onRecordingComplete: () => void;
  autoStart?: boolean;
  disabled?: boolean;
}

const AudioRecorder = ({ 
  questionId, 
  timeLimit, 
  onRecordingComplete,
  autoStart = false,
  disabled = false
}: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [recordingComplete, setRecordingComplete] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  
  useEffect(() => {
    setTimeRemaining(timeLimit);
    setRecordingComplete(false);
    
    if (autoStart && !disabled) {
      startRecording();
    }
    
    return () => {
      stopRecording();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLimit, autoStart, disabled]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Save the recording
        saveRecording(questionId, audioBlob)
          .then(() => {
            toast.success("Recording saved successfully");
            setRecordingComplete(true);
            onRecordingComplete();
          })
          .catch((err) => {
            console.error("Error saving recording:", err);
            toast.error("Failed to save recording");
          });
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingComplete(false);
      
      // Start the timer
      timerRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to access microphone. Please check permissions.");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center">
          {isRecording && (
            <Mic className="text-red-500 animate-pulse mr-2 h-5 w-5" />
          )}
          <span className="text-gray-500 text-sm">
            {isRecording ? "Recording..." : recordingComplete ? "Recording complete" : "Ready to record"}
          </span>
        </div>
        {isRecording && (
          <div className="text-gray-500 text-sm font-medium">
            {timeRemaining}s
          </div>
        )}
      </div>
      
      {!autoStart && !recordingComplete && (
        <div className="flex space-x-3">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              disabled={disabled}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Mic className="h-4 w-4 mr-2" />
              Start Recording
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              variant="destructive"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop Recording
            </Button>
          )}
        </div>
      )}
      
      {isRecording && (
        <div className="flex items-center justify-center my-4">
          <div className="animate-pulse flex space-x-1">
            <div className="h-3 w-3 bg-red-500 rounded-full"></div>
            <div className="h-4 w-3 bg-red-500 rounded-full"></div>
            <div className="h-5 w-3 bg-red-500 rounded-full"></div>
            <div className="h-4 w-3 bg-red-500 rounded-full"></div>
            <div className="h-3 w-3 bg-red-500 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
