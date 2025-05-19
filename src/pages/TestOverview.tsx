
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Book, Repeat, HelpCircle, Layers, FileText, MessageCircle, BookOpen, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import TestSectionCard from "@/components/TestSectionCard";

// Mock test structure data
const mockTestStructure = {
  testId: "test1",
  estimatedTime: "16 minutes",
  totalQuestions: 32,
  sections: [
    {
      id: "reading",
      title: "Reading",
      description: "Read sentences aloud",
      questions: 6,
      timePerQuestion: "20s",
      icon: "book"
    },
    {
      id: "repeat",
      title: "Repeat",
      description: "Listen and repeat sentences",
      questions: 8,
      timePerQuestion: "30s",
      icon: "repeat"
    },
    {
      id: "questions",
      title: "Questions",
      description: "Answer choice-based questions",
      questions: 5,
      timePerQuestion: "20s",
      icon: "help"
    },
    {
      id: "sentence-builds",
      title: "Sentence Builds",
      description: "Rearrange phrases correctly",
      questions: 4,
      timePerQuestion: "30s",
      icon: "layers"
    },
    {
      id: "story-retelling",
      title: "Story Retelling",
      description: "Listen and retell stories",
      questions: 2,
      timePerQuestion: "30s",
      icon: "file-text"
    },
    {
      id: "open-questions",
      title: "Open Questions",
      description: "Answer personal questions",
      questions: 3,
      timePerQuestion: "40s",
      icon: "message-circle"
    },
    {
      id: "conversations",
      title: "Conversations",
      description: "Listen and respond to dialogues",
      questions: 3,
      timePerQuestion: "30s",
      icon: "message-circle"
    },
    {
      id: "passage-comprehension",
      title: "Passage Comprehension",
      description: "Answer questions about passages",
      questions: 1,
      extraInfo: "3 questions, 90s total",
      icon: "book-open"
    }
  ]
};

const TestOverview = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [testData, setTestData] = useState<any>(null);
  
  useEffect(() => {
    // Simulate API call to fetch test structure
    const fetchTestStructure = async () => {
      try {
        // In a real app, this would be an API call:
        // const response = await fetch('/api/get_test_structure');
        // const data = await response.json();
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setTestData(mockTestStructure);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching test structure:", error);
        toast.error("Failed to load test overview. Please try again.");
        setIsLoading(false);
      }
    };
    
    fetchTestStructure();
  }, []);
  
  const handleStartTest = () => {
    navigate("/test/reading");
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading test overview...</p>
      </div>
    );
  }
  
  if (!testData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-red-500 mb-4">Failed to load test overview.</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4 py-8">
      <Card className="w-full max-w-5xl shadow-lg">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-center mb-2">Test Overview</h1>
          <p className="text-center text-gray-600 mb-8">
            Your assessment consists of {testData.totalQuestions} questions across {testData.sections.length} sections. 
            Estimated time: {testData.estimatedTime}.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {testData.sections.slice(0, 3).map((section: any) => (
              <TestSectionCard 
                key={section.id}
                title={section.title}
                description={section.description}
                questions={section.questions}
                timePerQuestion={section.timePerQuestion}
                extraInfo={section.extraInfo}
                icon={section.icon}
              />
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {testData.sections.slice(3, 6).map((section: any) => (
              <TestSectionCard 
                key={section.id}
                title={section.title}
                description={section.description}
                questions={section.questions}
                timePerQuestion={section.timePerQuestion}
                extraInfo={section.extraInfo}
                icon={section.icon}
              />
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {testData.sections.slice(6).map((section: any) => (
              <TestSectionCard 
                key={section.id}
                title={section.title}
                description={section.description}
                questions={section.questions}
                timePerQuestion={section.timePerQuestion}
                extraInfo={section.extraInfo}
                icon={section.icon}
              />
            ))}
          </div>
          
          <div className="flex flex-col items-center mt-12">
            <Button 
              onClick={handleStartTest}
              className="bg-blue-500 hover:bg-blue-600 transition-colors"
              size="lg"
            >
              Start Test
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Make sure your microphone and speakers are working before starting.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestOverview;
