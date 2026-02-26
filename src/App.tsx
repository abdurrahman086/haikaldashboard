import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FirebaseProvider } from "@/contexts/FirebaseContext";
import Dashboard from "./pages/Dashboard";
import ConfigPage from "./pages/ConfigPage";
import DevicesPage from "./pages/DevicesPage";
import TelemetryPage from "./pages/TelemetryPage";
import HelpPage from "./pages/HelpPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <FirebaseProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/config" element={<ConfigPage />} />
            <Route path="/devices" element={<DevicesPage />} />
            <Route path="/telemetry" element={<TelemetryPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FirebaseProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
