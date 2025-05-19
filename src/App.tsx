
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Prerequisites from "./pages/Prerequisites";
import Tips from "./pages/Tips";
import SampleTest from "./pages/SampleTest";
import TestOverview from "./pages/TestOverview";
import ReadingTest from "./pages/ReadingTest";
import RepeatTest from "./pages/RepeatTest";
import TestComplete from "./pages/TestComplete";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/prerequisites" element={<Prerequisites />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/sample" element={<SampleTest />} />
          <Route path="/test-overview" element={<TestOverview />} />
          <Route path="/test/reading" element={<ReadingTest />} />
          <Route path="/test/repeat" element={<RepeatTest />} />
          <Route path="/test-complete" element={<TestComplete />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
