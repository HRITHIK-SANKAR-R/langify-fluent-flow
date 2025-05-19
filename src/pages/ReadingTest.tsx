
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, ArrowRight, HelpCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import QuestionNumberPill from "@/components/QuestionNumberPill";

// Mock reading test data
const mockReadingTest = {
  id: "reading",
  title: "Reading Test",
  description: "Read each sentence aloud clearly and naturally",
  currentQuestion: 1,
  totalQuestions: 7,
  questions: [
    {
      id: "reading-q1",
      text: "The weather today is perfect for a walk in the park.",
      timeLimit: 15
    },
    {
      id: "reading-q2",
      text: "She decided to pursue a career in marine biology.",
      timeLimit: 15
    },
    {
      id: "reading-q3",
      text: "The conference has been rescheduled for next Tuesday.",
      timeLimit: 15
    },
    {
      id: "reading-q4",
      text: "The librarian recommended a fascinating book about ancient civilizations.",
      timeLimit: 15
    },
    {
      id: "reading-q5",
      text: "They're planning to renovate their house this summer.",
      timeLimit: 15
    },
    {
      id: "reading-q6",
      text: "The company announced a significant increase in quarterly profits yesterday.",
      timeLimit: 15
    },
    {
      id: "reading-q7",
      text: "Learning a new language requires consistent practice and dedication.",
      timeLimit: 15
    }
  ]
};

const ReadingTest = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  
  const currentQuestion = mockReadingTest.questions[currentQuestionIndex];
  
  useEffect(() => {
    // Reset state when question changes
    setTimeRemaining(currentQuestion.timeLimit);
    setIsRecording(false);
    setRecordingComplete(false);
    
    // Auto-start recording after a brief delay
    const startDelay = setTimeout(() => {
      startRecording();
    }, 2000);
    
    return () => {
      clearTimeout(startDelay);
      if (timerRef.current) clearInterval(timerRef.current);
      stopRecording();
    };
  }, [currentQuestionIndex]);
  
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
    if (currentQuestionIndex < mockReadingTest.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Navigate to the next test section
      navigate("/test/repeat");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-blue-50 p-4">
      <div className="max-w-5xl w-full mx-auto">
        <Card className="shadow-lg mt-8 mb-4">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">1. Reading Test</h1>
                <p className="text-gray-600">Read each sentence aloud clearly and naturally</p>
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
                    {mockReadingTest.questions.map((_, index) => (
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
                      <Mic className="text-gray-400 mr-2 h-5 w-5" />
                      <span className="text-gray-500 text-sm">
                        {isRecording ? "Recording... " : recordingComplete ? "Recording complete" : "Preparing to record..."}
                      </span>
                    </div>
                    <div className="text-gray-500 text-sm font-medium">
                      {timeRemaining}s
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-lg my-6 text-center">
                    <p className="text-lg font-medium">
                      "{currentQuestion.text}"
                    </p>
                  </div>
                  
                  <p className="text-center text-gray-600 mt-6">
                    Please read the sentence aloud.
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={handleNext}
                    disabled={isRecording && !recordingComplete}
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

export default ReadingTest;
