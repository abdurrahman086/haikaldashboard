import { useFirebase } from "@/contexts/FirebaseContext";
import DeviceCard from "@/components/DeviceCard";
import ConnectionStatus from "@/components/ConnectionStatus";

const DevicesPanel = () => {
  const { devices, isConfigured } = useFirebase();
  const switches = Object.entries(devices).filter(([, d]) => d.type === "switch");

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 pt-6">
      <div className="flex justify-center">
        <ConnectionStatus />
      </div>

      {!isConfigured || switches.length === 0 ? (
        <div className="glass-card flex min-h-[200px] items-center justify-center">
          <p className="text-muted-foreground">Tidak ada perangkat switch ditemukan</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {switches.map(([key, data]) => (
            <DeviceCard key={key} name={key} {...data} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DevicesPanel;
