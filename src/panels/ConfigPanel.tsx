import { useState, useRef, useEffect } from "react";
import { useFirebase } from "@/contexts/FirebaseContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TerminalLog from "@/components/TerminalLog";
import { Settings } from "lucide-react";
import { ref, set, getDatabase } from "firebase/database";
import { getApps } from "firebase/app";

const ConfigPanel = () => {
  const { config, setConfig, disconnect, isConfigured, addLog } = useFirebase();

  const [apiKey, setApiKey] = useState(config?.apiKey || "");
  const [dbUrl, setDbUrl] = useState(config?.databaseURL || "");
  const [path, setPath] = useState(config?.path || "");

  const [builderKey, setBuilderKey] = useState("");
  const [builderType, setBuilderType] = useState<string>("switch");
  const [builderUnit, setBuilderUnit] = useState("");
  const [builderLimit, setBuilderLimit] = useState("100");

  const [simMin, setSimMin] = useState("0");
  const [simMax, setSimMax] = useState("100");
  const [simInterval, setSimInterval] = useState("3");
  const [simRunning, setSimRunning] = useState(false);
  const [simDuration, setSimDuration] = useState("30");
  const [simRemaining, setSimRemaining] = useState(0);
  const simTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const simStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const simCountdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleConnect = () => {
    if (!apiKey || !dbUrl) return;
    setConfig({ apiKey, databaseURL: dbUrl, path: path || "/" });
    addLog("Firebase configuration saved");
  };

  const handlePushStructure = () => {
    if (!builderKey || !isConfigured || !config) return;
    try {
      const apps = getApps();
      const app = apps.find(a => a.name.startsWith("iot-app-"));
      if (!app) { addLog("Error: Firebase not initialized"); return; }
      const db = getDatabase(app);
      const devicePath = `${config.path}/${builderKey}`;
      const data: any = { type: builderType, value: 0 };
      if (builderType !== "switch") {
        data.upper_limit = parseInt(builderLimit) || 100;
        data.unit = builderUnit || "";
      }
      set(ref(db, devicePath), data);
      addLog(`Pushed '${builderKey}' as ${builderType}`);
      setBuilderKey("");
    } catch (err: any) {
      addLog(`Push error: ${err.message}`);
    }
  };

  const pushSimData = () => {
    if (!isConfigured || !config) return;
    try {
      const apps = getApps();
      const app = apps.find(a => a.name.startsWith("iot-app-"));
      if (!app) { addLog("Error: Firebase not initialized"); return; }
      const db = getDatabase(app);
      const basePath = config.path;

      const dummyData: Record<string, any> = {
        room_lamp: { type: "switch", value: Math.round(Math.random()) },
        room_fan: { type: "switch", value: Math.round(Math.random()) },
        humidity: {
          type: "sensor",
          value: Math.round(Math.random() * (parseInt(simMax) - parseInt(simMin)) + parseInt(simMin)),
          upper_limit: parseInt(simMax),
          unit: "%",
        },
        temperature: {
          type: "sensor",
          value: +(Math.random() * 40 + 10).toFixed(1),
          upper_limit: 100,
          unit: "°C",
        },
        fan_speed: {
          type: "dimmer",
          value: Math.round(Math.random() * 1024),
          upper_limit: 1024,
          unit: "RPM",
        },
      };

      set(ref(db, basePath), dummyData);
      addLog("Simulation data pushed");
    } catch (err: any) {
      addLog(`Simulation error: ${err.message}`);
    }
  };

  const stopSimulation = () => {
    if (simTimerRef.current) clearInterval(simTimerRef.current);
    if (simStopRef.current) clearTimeout(simStopRef.current);
    if (simCountdownRef.current) clearInterval(simCountdownRef.current);
    simTimerRef.current = null;
    simStopRef.current = null;
    simCountdownRef.current = null;
    setSimRunning(false);
    setSimRemaining(0);
    addLog("Simulation stopped");
  };

  const handleToggleSimulation = () => {
    if (simRunning) {
      stopSimulation();
    } else {
      pushSimData();
      const intervalMs = Math.max(1, parseFloat(simInterval) || 3) * 1000;
      const durationMs = Math.max(1, parseFloat(simDuration) || 30) * 1000;
      simTimerRef.current = setInterval(pushSimData, intervalMs);
      setSimRemaining(Math.ceil(durationMs / 1000));
      simCountdownRef.current = setInterval(() => {
        setSimRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
      simStopRef.current = setTimeout(stopSimulation, durationMs);
      setSimRunning(true);
      addLog(`Simulation started (interval: ${intervalMs / 1000}s, duration: ${durationMs / 1000}s)`);
    }
  };

  useEffect(() => {
    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
      if (simStopRef.current) clearTimeout(simStopRef.current);
      if (simCountdownRef.current) clearInterval(simCountdownRef.current);
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 pt-6">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Firebase Config */}
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground">Firebase</h3>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input placeholder="API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="bg-secondary" />
          <Input placeholder="Database URL" value={dbUrl} onChange={(e) => setDbUrl(e.target.value)} className="bg-secondary" />
          <Input placeholder="Path (e.g. /iot/monitoring)" value={path} onChange={(e) => setPath(e.target.value)} className="bg-secondary" />
          <Button onClick={handleConnect} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Connect Database</Button>
          {isConfigured && (
            <Button variant="outline" onClick={disconnect} className="w-full text-destructive">Disconnect</Button>
          )}
        </div>

        {/* Builder */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-bold text-foreground">Builder</h3>
          <Input placeholder="Key Name" value={builderKey} onChange={(e) => setBuilderKey(e.target.value)} className="bg-secondary" />
          <div className="grid grid-cols-2 gap-2">
            <Select value={builderType} onValueChange={setBuilderType}>
              <SelectTrigger className="bg-secondary"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="switch">Switch</SelectItem>
                <SelectItem value="dimmer">Dimmer</SelectItem>
                <SelectItem value="sensor">Sensor</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Unit" value={builderUnit} onChange={(e) => setBuilderUnit(e.target.value)} className="bg-secondary" />
          </div>
          <Input placeholder="Upper Limit" value={builderLimit} onChange={(e) => setBuilderLimit(e.target.value)} className="bg-secondary" />
          <Button onClick={handlePushStructure} disabled={!isConfigured} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Save Structure</Button>
        </div>

        {/* Simulator */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-bold text-foreground">Global Simulator</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">Min</label>
              <Input value={simMin} onChange={(e) => setSimMin(e.target.value)} className="bg-secondary" disabled={simRunning} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Max</label>
              <Input value={simMax} onChange={(e) => setSimMax(e.target.value)} className="bg-secondary" disabled={simRunning} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">Interval (s)</label>
              <Input value={simInterval} onChange={(e) => setSimInterval(e.target.value)} className="bg-secondary" disabled={simRunning} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Durasi (s)</label>
              <Input value={simDuration} onChange={(e) => setSimDuration(e.target.value)} className="bg-secondary" disabled={simRunning} />
            </div>
          </div>
          {simRunning && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Mengirim setiap {simInterval}s
              </div>
              <span className="font-mono font-medium text-foreground">{simRemaining}s tersisa</span>
            </div>
          )}
          <Button
            onClick={handleToggleSimulation}
            disabled={!isConfigured}
            className={`w-full ${simRunning ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-foreground text-background hover:bg-foreground/90"}`}
          >
            {simRunning ? "Stop Simulation" : "Start Simulation"}
          </Button>
        </div>
      </div>
      <TerminalLog />
    </div>
  );
};

export default ConfigPanel;
