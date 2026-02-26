import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { initializeApp, FirebaseApp, deleteApp } from "firebase/app";
import { getDatabase, ref, onValue, set, Database, off } from "firebase/database";

interface FirebaseConfig {
  apiKey: string;
  databaseURL: string;
  path: string;
}

interface DeviceData {
  type: "switch" | "dimmer" | "sensor";
  value: number;
  upper_limit?: number;
  unit?: string;
}

interface LogEntry {
  id: string;
  message: string;
  timestamp: Date;
}

interface FirebaseContextType {
  config: FirebaseConfig | null;
  setConfig: (config: FirebaseConfig) => void;
  disconnect: () => void;
  isConnected: boolean;
  devices: Record<string, DeviceData>;
  updateDevice: (key: string, value: number) => void;
  logs: LogEntry[];
  addLog: (message: string) => void;
  clearLogs: () => void;
  isConfigured: boolean;
  sensorHistory: Record<string, number[]>;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const useFirebase = () => {
  const ctx = useContext(FirebaseContext);
  if (!ctx) throw new Error("useFirebase must be used within FirebaseProvider");
  return ctx;
};

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfigState] = useState<FirebaseConfig | null>(() => {
    const saved = localStorage.getItem("firebase_config");
    return saved ? JSON.parse(saved) : null;
  });
  const [isConnected, setIsConnected] = useState(false);
  const [devices, setDevices] = useState<Record<string, DeviceData>>({});
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [sensorHistory, setSensorHistory] = useState<Record<string, number[]>>({});
  const appRef = useRef<FirebaseApp | null>(null);
  const dbRef = useRef<Database | null>(null);

  const addLog = useCallback((message: string) => {
    setLogs((prev) => [
      ...prev,
      { id: crypto.randomUUID(), message, timestamp: new Date() },
    ]);
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  const setConfig = useCallback((c: FirebaseConfig) => {
    localStorage.setItem("firebase_config", JSON.stringify(c));
    setConfigState(c);
  }, []);

  const disconnect = useCallback(() => {
    if (appRef.current) {
      deleteApp(appRef.current).catch(() => {});
      appRef.current = null;
      dbRef.current = null;
    }
    setIsConnected(false);
    setDevices({});
    setSensorHistory({});
    localStorage.removeItem("firebase_config");
    setConfigState(null);
    addLog("Disconnected from Firebase");
  }, [addLog]);

  const updateDevice = useCallback(
    (key: string, value: number) => {
      if (!dbRef.current || !config) return;
      const deviceRef = ref(dbRef.current, `${config.path}/${key}/value`);
      set(deviceRef, value);
      addLog(`Device '${key}' set to ${value}`);
    },
    [config, addLog]
  );

  useEffect(() => {
    if (!config?.apiKey || !config?.databaseURL) return;

    // Cleanup previous
    if (appRef.current) {
      deleteApp(appRef.current).catch(() => {});
    }

    try {
      const app = initializeApp(
        { apiKey: config.apiKey, databaseURL: config.databaseURL },
        `iot-app-${Date.now()}`
      );
      appRef.current = app;
      const db = getDatabase(app);
      dbRef.current = db;

      // Connection status
      const connRef = ref(db, ".info/connected");
      onValue(connRef, (snap) => {
        const connected = snap.val() === true;
        setIsConnected(connected);
        addLog(connected ? "Connected to Firebase" : "Disconnected from Firebase");
      });

      // Data listener
      const dataPath = config.path || "/";
      const dataRef = ref(db, dataPath);
      onValue(dataRef, (snap) => {
        const data = snap.val();
        if (!data || typeof data !== "object") {
          setDevices({});
          return;
        }
        const parsed: Record<string, DeviceData> = {};
        for (const [key, val] of Object.entries(data)) {
          if (val && typeof val === "object" && "type" in (val as any)) {
            const d = val as any;
            parsed[key] = {
              type: d.type,
              value: d.value ?? 0,
              upper_limit: d.upper_limit,
              unit: d.unit,
            };
            // Track sensor history
            if (d.type === "sensor") {
              setSensorHistory((prev) => {
                const history = prev[key] ? [...prev[key]] : [];
                history.push(d.value ?? 0);
                if (history.length > 20) history.shift();
                return { ...prev, [key]: history };
              });
            }
          }
        }
        setDevices(parsed);
        addLog(`Data synced: ${Object.keys(parsed).length} devices`);
      });

      addLog("Connecting to Firebase...");

      return () => {
        off(connRef);
        off(dataRef);
      };
    } catch (err: any) {
      addLog(`Firebase error: ${err.message}`);
    }
  }, [config?.apiKey, config?.databaseURL, config?.path]);

  return (
    <FirebaseContext.Provider
      value={{
        config,
        setConfig,
        disconnect,
        isConnected,
        devices,
        updateDevice,
        logs,
        addLog,
        clearLogs,
        isConfigured: !!config?.apiKey && !!config?.databaseURL,
        sensorHistory,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
