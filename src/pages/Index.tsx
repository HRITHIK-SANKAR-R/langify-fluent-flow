
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import WelcomeCard from "@/components/WelcomeCard";
import { toast } from "@/components/ui/sonner";

const Index = () => {
  const navigate = useNavigate();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartTest = () => {
    setIsStarting(true);
    toast.success("Starting test prerequisites check");
    setTimeout(() => {
      navigate("/prerequisites");
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <Card className="w-full max-w-3xl shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <WelcomeCard 
            onStartTest={handleStartTest}
            isStarting={isStarting}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
