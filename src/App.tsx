import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FirebaseProvider } from "@/contexts/FirebaseContext";
import { useState } from "react";
import DashboardPanel from "@/panels/DashboardPanel";
import ConfigPanel from "@/panels/ConfigPanel";
import DevicesPanel from "@/panels/DevicesPanel";
import TelemetryPanel from "@/panels/TelemetryPanel";
import HelpPanel from "@/panels/HelpPanel";
import BottomNav from "@/components/BottomNav";

export type TabKey = "dashboard" | "config" | "devices" | "telemetry" | "help";

const queryClient = new QueryClient();

const App = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <FirebaseProvider>
          <div className="min-h-screen pb-28">
            {/* All panels rendered, only active one visible — preserves state */}
            <div className={activeTab === "dashboard" ? "" : "hidden"}><DashboardPanel /></div>
            <div className={activeTab === "config" ? "" : "hidden"}><ConfigPanel /></div>
            <div className={activeTab === "devices" ? "" : "hidden"}><DevicesPanel /></div>
            <div className={activeTab === "telemetry" ? "" : "hidden"}><TelemetryPanel /></div>
            <div className={activeTab === "help" ? "" : "hidden"}><HelpPanel /></div>
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </FirebaseProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
