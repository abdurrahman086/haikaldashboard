import { LayoutGrid, Home, Cloud, Power, BarChart3, HelpCircle } from "lucide-react";
import type { TabKey } from "@/App";

const navItems: { icon: typeof LayoutGrid; tab: TabKey; label: string }[] = [
  { icon: LayoutGrid, tab: "dashboard", label: "Dashboard" },
  { icon: Cloud, tab: "config", label: "Config" },
  { icon: Power, tab: "devices", label: "Devices" },
  { icon: BarChart3, tab: "telemetry", label: "Telemetry" },
  { icon: HelpCircle, tab: "help", label: "Help" },
];

interface BottomNavProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.tab;
          return (
            <button
              key={item.label}
              onClick={() => onTabChange(item.tab)}
              className={`rounded-full p-3 transition-colors ${
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={item.label}
            >
              <Icon className="h-6 w-6" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
