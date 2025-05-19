
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, ArrowRight, HelpCircle, Play, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import QuestionNumberPill from "@/components/QuestionNumberPill";
import { fetchSectionQuestions, getAudioUrl, saveRecording } from "@/services/apiService";

interface Question {
  question_id: string;
  audio_file: string;
  text?: string;
  timeLimit: number;
}

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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  
  // Default test ID and section type
  const testId = "test1";
  const sectionType = "repeat";
  
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSectionQuestions(testId, sectionType);
        
        // Transform the data to include timeLimit
        const questionsWithTimeLimit = data.questions.map(q => ({
          ...q,
          timeLimit: 30 // default 30 seconds for each question
        }));
        
        setQuestions(questionsWithTimeLimit);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading questions:", err);
        setError("Failed to load questions. Please try again.");
        setIsLoading(false);
      }
    };
    
    loadQuestions();
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);
  
  useEffect(() => {
    // Reset state when question changes or when questions are loaded
    if (questions.length === 0) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    setTimeRemaining(currentQuestion.timeLimit);
    setAudioPlayed(false);
    setIsAudioPlaying(false);
    setIsAudioLoading(false);
    setIsRecording(false);
    setRecordingComplete(false);
    setReplayCount(2);
    
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('ended', handleAudioEnded);
    }
    
    // Set the audio source URL
    const audioUrl = getAudioUrl(currentQuestion.question_id);
    audioRef.current.src = audioUrl;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', handleAudioEnded);
      }
      
      if (timerRef.current) clearInterval(timerRef.current);
      stopRecording();
    };
  }, [currentQuestionIndex, questions]);
  
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
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion) setTimeRemaining(currentQuestion.timeLimit);
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
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        // Save the recording using our API service
        const currentQuestion = questions[currentQuestionIndex];
        if (currentQuestion) {
          saveRecording(currentQuestion.question_id, audioBlob)
            .then(() => {
              toast.success("Recording saved successfully");
            })
            .catch((err) => {
              console.error("Error saving recording:", err);
              toast.error("Failed to save recording");
            });
        }
        
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
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Navigate to the next test section - in a real app, you would dynamically determine the next section
      navigate("/test-complete");
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-4">
        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading questions...</p>
      </div>
    );
  }
  
  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-red-500 mb-4">{error || "No questions available for this test."}</p>
            <Button 
              onClick={() => navigate("/test-overview")}
              variant="outline"
            >
              Back to Test Overview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
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
                    {questions.map((_, index) => (
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
                  
                  {audioPlayed && currentQuestion.text && (
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
