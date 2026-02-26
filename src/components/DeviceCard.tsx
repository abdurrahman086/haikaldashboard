import { useFirebase } from "@/contexts/FirebaseContext";
import { Zap } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

interface DeviceCardProps {
  name: string;
  type: "switch" | "dimmer" | "sensor";
  value: number;
  upperLimit?: number;
  unit?: string;
}

const SwitchCard = ({ name, value }: { name: string; value: number }) => {
  const { updateDevice } = useFirebase();
  const isOn = value === 1;

  return (
    <button
      onClick={() => updateDevice(name, isOn ? 0 : 1)}
      className={`flex h-32 w-32 flex-col items-center justify-center rounded-xl border-2 transition-all ${
        isOn
          ? "border-primary bg-primary text-primary-foreground shadow-lg"
          : "border-border bg-muted text-muted-foreground"
      }`}
    >
      <Zap className="mb-2 h-10 w-10" />
      <span className="text-sm font-bold capitalize">{name.replace(/_/g, " ")}</span>
    </button>
  );
};

const DimmerCard = ({
  name,
  value,
  upperLimit = 1024,
  unit,
}: {
  name: string;
  value: number;
  upperLimit?: number;
  unit?: string;
}) => {
  const { updateDevice } = useFirebase();

  return (
    <div className="glass-card p-4 w-64">
      <h3 className="text-sm font-bold capitalize text-foreground">{name.replace(/_/g, " ")}</h3>
      <p className="text-xs text-muted-foreground mb-3">
        {value} {unit && `${unit}`}
      </p>
      <Slider
        value={[value]}
        min={0}
        max={upperLimit}
        step={1}
        onValueChange={([v]) => updateDevice(name, v)}
      />
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span>{upperLimit}</span>
      </div>
    </div>
  );
};

const SensorCard = ({
  name,
  value,
  unit,
  history,
}: {
  name: string;
  value: number;
  unit?: string;
  history: number[];
}) => {
  const chartData = history.map((v, i) => ({ idx: i, value: v }));

  return (
    <div className="glass-card p-4 w-72">
      <h3 className="text-sm font-bold capitalize text-foreground">{name.replace(/_/g, " ")}</h3>
      <p className="text-xs text-muted-foreground mb-2">
        {value}
        {unit}
      </p>
      <ResponsiveContainer width="100%" height={80}>
        <LineChart data={chartData}>
          <YAxis domain={["auto", "auto"]} hide />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--accent))"
            strokeWidth={2}
            dot={{ r: 2, fill: "hsl(var(--accent))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const DeviceCard = ({ name, type, value, upperLimit, unit }: DeviceCardProps) => {
  const { sensorHistory } = useFirebase();

  switch (type) {
    case "switch":
      return <SwitchCard name={name} value={value} />;
    case "dimmer":
      return <DimmerCard name={name} value={value} upperLimit={upperLimit} unit={unit} />;
    case "sensor":
      return (
        <SensorCard
          name={name}
          value={value}
          unit={unit}
          history={sensorHistory[name] || [value]}
        />
      );
    default:
      return null;
  }
};

export default DeviceCard;
