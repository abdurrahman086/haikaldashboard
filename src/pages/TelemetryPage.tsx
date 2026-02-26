import { useFirebase } from "@/contexts/FirebaseContext";
import DeviceCard from "@/components/DeviceCard";
import ConnectionStatus from "@/components/ConnectionStatus";
import TerminalLog from "@/components/TerminalLog";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TelemetryPage = () => {
  const { devices, isConfigured } = useFirebase();
  const navigate = useNavigate();
  const sensors = Object.entries(devices).filter(([, d]) => d.type === "sensor");

  return (
    <div className="min-h-screen pb-28">
      <div className="mx-auto max-w-5xl space-y-8 px-4 pt-6">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="flex justify-center">
          <ConnectionStatus />
        </div>

        {!isConfigured || sensors.length === 0 ? (
          <div className="glass-card flex min-h-[200px] items-center justify-center">
            <p className="text-muted-foreground">Tidak ada sensor telemetri ditemukan</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {sensors.map(([key, data]) => (
              <DeviceCard key={key} name={key} {...data} upperLimit={data.upper_limit} />
            ))}
          </div>
        )}

        <TerminalLog />
      </div>
      <BottomNav />
    </div>
  );
};

export default TelemetryPage;
