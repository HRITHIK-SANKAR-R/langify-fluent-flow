
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, ArrowRight, HelpCircle, Play, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import QuestionNumberPill from "@/components/QuestionNumberPill";

// Mock repeat test data
const mockRepeatTest = {
  id: "repeat",
  title: "Repeat Test",
  description: "Listen and repeat each sentence exactly as you hear it",
  currentQuestion: 1,
  totalQuestions: 8,
  questions: [
    {
      id: "repeat-q1",
      audioUrl: "/sample-audio.mp3", // In a real app, this would be dynamic
      text: "The company announced a significant increase in quarterly profits yesterday.",
      timeLimit: 27
    },
    {
      id: "repeat-q2",
      audioUrl: "/sample-audio.mp3",
      text: "The researchers published their findings in a prestigious scientific journal.",
      timeLimit: 27
    },
    {
      id: "repeat-q3",
      audioUrl: "/sample-audio.mp3",
      text: "She's considering applying for a scholarship to study abroad next year.",
      timeLimit: 27
    },
    {
      id: "repeat-q4",
      audioUrl: "/sample-audio.mp3",
      text: "The museum is hosting a special exhibition featuring works by local artists.",
      timeLimit: 27
    },
    {
      id: "repeat-q5",
      audioUrl: "/sample-audio.mp3",
      text: "They've implemented a new policy to reduce plastic waste in the office.",
      timeLimit: 27
    },
    {
      id: "repeat-q6",
      audioUrl: "/sample-audio.mp3",
      text: "The conference will be held at the international convention center downtown.",
      timeLimit: 27
    },
    {
      id: "repeat-q7",
      audioUrl: "/sample-audio.mp3",
      text: "Regular exercise can significantly improve both physical and mental health.",
      timeLimit: 27
    },
    {
      id: "repeat-q8",
      audioUrl: "/sample-audio.mp3",
      text: "We need to reschedule the meeting because several team members are unavailable.",
      timeLimit: 27
    }
  ]
};

const RepeatTest = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [replayCount, setReplayCount] = useState(2);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  
  const currentQuestion = mockRepeatTest.questions[currentQuestionIndex];
  
  useEffect(() => {
    // Reset state when question changes
    setTimeRemaining(currentQuestion.timeLimit);
    setAudioPlayed(false);
    setIsAudioPlaying(false);
    setIsAudioLoading(false);
    setIsRecording(false);
    setRecordingComplete(false);
    setReplayCount(2);
    
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio(currentQuestion.audioUrl);
      audioRef.current.addEventListener('ended', handleAudioEnded);
    } else {
      audioRef.current.src = currentQuestion.audioUrl;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.removeEventListener('ended', handleAudioEnded);
      }
      
      if (timerRef.current) clearInterval(timerRef.current);
      stopRecording();
    };
  }, [currentQuestionIndex]);
  
  const handleAudioEnded = () => {
    setIsAudioPlaying(false);
    setAudioPlayed(true);
    
    // Start recording after a short delay
    setTimeout(() => {
      startRecording();
    }, 1000);
  };
  
  const playAudio = () => {
    if (!audioRef.current) return;
    
    setIsAudioLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      if (audioRef.current) {
        setIsAudioLoading(false);
        setIsAudioPlaying(true);
        
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          toast.error("Failed to play audio. Please try again.");
          setIsAudioPlaying(false);
        });
      }
    }, 800);
  };
  
  const replayAudio = () => {
    if (replayCount <= 0 || !audioRef.current) return;
    
    setReplayCount(prev => prev - 1);
    setIsAudioPlaying(true);
    
    if (isRecording) {
      stopRecording();
      setTimeRemaining(currentQuestion.timeLimit);
    }
    
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(error => {
      console.error("Error replaying audio:", error);
      toast.error("Failed to replay audio.");
      setIsAudioPlaying(false);
    });
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        // In a real app, we would save this blob or upload it
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        console.log(`Recording saved for question ${currentQuestion.id}`, audioBlob);
        
        // Simulate saving the recording
        toast.success("Recording saved successfully");
        setRecordingComplete(true);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      
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
  
  const handleNext = () => {
    if (currentQuestionIndex < mockRepeatTest.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Navigate to the next test section - in a real app, you would dynamically determine the next section
      navigate("/test-complete");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-blue-50 p-4">
      <div className="max-w-5xl w-full mx-auto">
        <Card className="shadow-lg mt-8 mb-4">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">2. Repeat Test</h1>
                <p className="text-gray-600">Listen and repeat each sentence exactly as you hear it</p>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-500">
                <HelpCircle className="h-4 w-4 mr-1" /> Help
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <h3 className="font-medium mb-3 text-gray-700">Questions</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {mockRepeatTest.questions.map((_, index) => (
                      <QuestionNumberPill 
                        key={index}
                        number={index + 1}
                        active={index === currentQuestionIndex}
                        complete={index < currentQuestionIndex}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="md:w-3/4">
                <div className="bg-white p-6 rounded-lg border shadow-sm mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {!audioPlayed ? (
                        <span className="text-gray-500 text-sm">
                          {isAudioPlaying ? "Playing audio..." : "Ready to play audio"}
                        </span>
                      ) : isRecording ? (
                        <div className="flex items-center">
                          <Mic className="text-red-500 animate-pulse mr-2 h-5 w-5" />
                          <span className="text-gray-500 text-sm">Recording...</span>
                        </div>
                      ) : recordingComplete ? (
                        <span className="text-gray-500 text-sm">Recording complete</span>
                      ) : (
                        <span className="text-gray-500 text-sm">Preparing to record...</span>
                      )}
                    </div>
                    <div className="text-gray-500 text-sm font-medium">
                      {isRecording ? `${timeRemaining}s` : ""}
                    </div>
                  </div>
                  
                  {audioPlayed && (
                    <div className="bg-blue-50 p-6 rounded-lg my-6 text-center">
                      <p className="text-lg font-medium">
                        "{currentQuestion.text}"
                      </p>
                    </div>
                  )}
                  
                  {!audioPlayed && !isAudioPlaying ? (
                    <div className="flex justify-center my-10">
                      <Button
                        onClick={playAudio}
                        disabled={isAudioLoading}
                        className="bg-blue-500 hover:bg-blue-600"
                        size="lg"
                      >
                        {isAudioLoading ? (
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
                  ) : isAudioPlaying ? (
                    <div className="flex items-center justify-center my-10">
                      <div className="animate-pulse flex space-x-1">
                        <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                        <div className="h-4 w-3 bg-blue-500 rounded-full"></div>
                        <div className="h-5 w-3 bg-blue-500 rounded-full"></div>
                        <div className="h-4 w-3 bg-blue-500 rounded-full"></div>
                        <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  ) : null}
                  
                  {audioPlayed && !isAudioPlaying && (
                    <p className="text-center text-gray-600 mt-6">
                      Repeat the sentence you just heard.
                    </p>
                  )}
                  
                  {audioPlayed && !isAudioPlaying && replayCount > 0 && (
                    <div className="flex justify-center mt-6">
                      <Button
                        onClick={replayAudio}
                        variant="outline"
                        size="sm"
                        className="text-blue-500 border-blue-300"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Replay Audio ({replayCount} left)
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={handleNext}
                    disabled={!audioPlayed || (isRecording && !recordingComplete)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RepeatTest;
