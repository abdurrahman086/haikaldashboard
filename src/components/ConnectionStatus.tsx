import { useFirebase } from "@/contexts/FirebaseContext";

const ConnectionStatus = () => {
  const { isConnected, isConfigured } = useFirebase();

  if (!isConfigured) return null;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
      <span
        className={`h-3 w-3 rounded-full ${
          isConnected ? "bg-success pulse-green" : "bg-danger pulse-red"
        }`}
      />
      <span className="text-sm font-medium text-foreground">
        {isConnected ? "Connected" : "Disconnected"}
      </span>
    </div>
  );
};

export default ConnectionStatus;
