import { useFirebase } from "@/contexts/FirebaseContext";
import DeviceCard from "@/components/DeviceCard";
import ConnectionStatus from "@/components/ConnectionStatus";
import TerminalLog from "@/components/TerminalLog";
import BottomNav from "@/components/BottomNav";
import JsonGuideModal from "@/components/JsonGuideModal";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const { devices, isConfigured } = useFirebase();
  const [showGuide, setShowGuide] = useState(false);
  const deviceEntries = Object.entries(devices);

  const switches = deviceEntries.filter(([, d]) => d.type === "switch");
  const dimmers = deviceEntries.filter(([, d]) => d.type === "dimmer");
  const sensors = deviceEntries.filter(([, d]) => d.type === "sensor");

  // Show guide on first visit
  useEffect(() => {
    const seen = localStorage.getItem("json_guide_seen");
    if (!seen) {
      setShowGuide(true);
      localStorage.setItem("json_guide_seen", "1");
    }
  }, []);

  return (
    <div className="min-h-screen pb-28">
      <JsonGuideModal open={showGuide} onOpenChange={setShowGuide} />

      <div className="mx-auto max-w-5xl space-y-8 px-4 pt-8">
        {/* Connection */}
        <div className="flex justify-center">
          <ConnectionStatus />
        </div>

        {/* Gated content */}
        {!isConfigured ? (
          <div className="glass-card flex min-h-[200px] items-center justify-center">
            <p className="text-muted-foreground">
              Konfigurasikan Firebase terlebih dahulu di tab{" "}
              <span className="font-semibold text-accent">Config</span>.
            </p>
          </div>
        ) : deviceEntries.length === 0 ? (
          <div className="glass-card flex min-h-[200px] items-center justify-center">
            <p className="text-muted-foreground">
              Menunggu sinkronisasi data terstruktur
            </p>
          </div>
        ) : (
          <>
            {/* Switches */}
            {switches.length > 0 && (
              <section>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Switch
                </h2>
                <div className="flex flex-wrap gap-4">
                  {switches.map(([key, data]) => (
                    <DeviceCard key={key} name={key} {...data} upperLimit={data.upper_limit} />
                  ))}
                </div>
              </section>
            )}

            {/* Dimmers */}
            {dimmers.length > 0 && (
              <section>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Dimmer
                </h2>
                <div className="flex flex-wrap gap-4">
                  {dimmers.map(([key, data]) => (
                    <DeviceCard key={key} name={key} {...data} upperLimit={data.upper_limit} />
                  ))}
                </div>
              </section>
            )}

            {/* Sensors */}
            {sensors.length > 0 && (
              <section>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Sensor
                </h2>
                <div className="flex flex-wrap gap-4">
                  {sensors.map(([key, data]) => (
                    <DeviceCard key={key} name={key} {...data} upperLimit={data.upper_limit} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Terminal */}
        <TerminalLog />
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
