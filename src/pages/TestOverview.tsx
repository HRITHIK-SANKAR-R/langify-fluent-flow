
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import TestSectionCard from "@/components/TestSectionCard";
import { fetchTestStructure, TestStructure } from "@/services/apiService";

// Helper function to convert test structure to UI data
const convertToSectionData = (testStructure: TestStructure, testId: string) => {
  if (!testStructure || !testStructure[testId]) return [];
  
  const sections = testStructure[testId];
  
  const sectionTypeToInfo = {
    'reading': {
      title: 'Reading',
      description: 'Read sentences aloud',
      icon: 'book',
      timePerQuestion: '20s'
    },
    'repeat': {
      title: 'Repeat',
      description: 'Listen and repeat sentences',
      icon: 'repeat',
      timePerQuestion: '30s'
    },
    'questions': {
      title: 'Questions',
      description: 'Answer choice-based questions',
      icon: 'help',
      timePerQuestion: '20s'
    },
    'sentence-builds': {
      title: 'Sentence Builds',
      description: 'Rearrange phrases correctly',
      icon: 'layers',
      timePerQuestion: '30s'
    },
    'story-retelling': {
      title: 'Story Retelling',
      description: 'Listen and retell stories',
      icon: 'file-text',
      timePerQuestion: '30s'
    },
    'open-questions': {
      title: 'Open Questions',
      description: 'Answer personal questions',
      icon: 'message-circle',
      timePerQuestion: '40s'
    },
    'conversations': {
      title: 'Conversations',
      description: 'Listen and respond to dialogues',
      icon: 'message-circle',
      timePerQuestion: '30s'
    },
    'comprehension': {
      title: 'Passage Comprehension',
      description: 'Answer questions about passages',
      icon: 'book-open',
      timePerQuestion: '30s',
      extraInfo: 'Includes passage'
    }
  };
  
  return sections.map(section => {
    const info = sectionTypeToInfo[section.type] || {
      title: section.type.charAt(0).toUpperCase() + section.type.slice(1),
      description: `${section.type} questions`,
      icon: 'help',
      timePerQuestion: '30s'
    };
    
    return {
      id: section.type,
      title: info.title,
      description: info.description,
      questions: section.qid[0].length,
      timePerQuestion: info.timePerQuestion,
      extraInfo: info.extraInfo,
      icon: info.icon
    };
  });
};

const TestOverview = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [testData, setTestData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const getTestStructure = async () => {
      try {
        setIsLoading(true);
        const testStructure = await fetchTestStructure();
        
        // For now, we'll just use test1 as the default test
        const testId = "test1";
        
        const sectionsData = convertToSectionData(testStructure, testId);
        
        // Calculate total questions and estimated time
        const totalQuestions = sectionsData.reduce((sum, section) => sum + section.questions, 0);
        const estimatedTime = Math.round(totalQuestions * 0.5); // rough estimate: 30 seconds per question
        
        setTestData({
          testId,
          estimatedTime: `${estimatedTime} minutes`,
          totalQuestions,
          sections: sectionsData
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching test structure:", error);
        toast.error("Failed to load test overview. Please try again.");
        setError("Failed to load test overview. Please try again.");
        setIsLoading(false);
      }
    };
    
    getTestStructure();
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
  
  if (error || !testData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-red-500 mb-4">{error || "Failed to load test overview."}</p>
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
  
  // Split sections into groups for layout
  const firstGroup = testData.sections.slice(0, Math.min(3, testData.sections.length));
  const secondGroup = testData.sections.slice(3, Math.min(6, testData.sections.length));
  const thirdGroup = testData.sections.slice(6);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4 py-8">
      <Card className="w-full max-w-5xl shadow-lg">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-center mb-2">Test Overview</h1>
          <p className="text-center text-gray-600 mb-8">
            Your assessment consists of {testData.totalQuestions} questions across {testData.sections.length} sections. 
            Estimated time: {testData.estimatedTime}.
          </p>
          
          {firstGroup.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {firstGroup.map((section: any) => (
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
          )}
          
          {secondGroup.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {secondGroup.map((section: any) => (
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
          )}
          
          {thirdGroup.length > 0 && (
            <div className={`grid grid-cols-1 md:grid-cols-${thirdGroup.length > 1 ? "2" : "1"} gap-4 mb-8`}>
              {thirdGroup.map((section: any) => (
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
          )}
          
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
