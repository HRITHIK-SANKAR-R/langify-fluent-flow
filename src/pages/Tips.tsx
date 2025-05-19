
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import TipCard from "@/components/TipCard";

const Tips = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-center mb-2">Tips & Rules</h1>
          <p className="text-center text-gray-600 mb-8">
            Before you begin the test, here are some helpful tips and rules to 
            ensure you perform at your best.
          </p>
          
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2 text-blue-500">💡</span> Helpful Tips
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <TipCard
              icon="volume"
              title="Speak Clearly"
              description="Speak at a normal pace and volume. Don't rush your answers."
            />
            
            <TipCard
              icon="mic"
              title="Find a Quiet Environment"
              description="Minimize background noise for the best recording quality."
            />
            
            <TipCard
              icon="clock"
              title="Watch the Timer"
              description="Each question has a time limit. Try to answer within the given time."
            />
            
            <TipCard
              icon="user"
              title="Don't Panic"
              description="Stay calm if you make a mistake. Focus on the current question."
            />
          </div>
          
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2 text-blue-500">✓</span> Basic Rules
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <TipCard
              icon="shield"
              title="Be Yourself"
              description="Answer naturally. The test measures your actual language ability."
            />
            
            <TipCard
              icon="book"
              title="Follow Instructions"
              description="Read or listen to the instructions carefully before answering."
            />
          </div>
          
          <div className="flex justify-center mt-8">
            <Button 
              onClick={() => navigate("/sample")}
              className="bg-blue-500 hover:bg-blue-600 transition-colors"
              size="lg"
            >
              Continue to Sample Test
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tips;
