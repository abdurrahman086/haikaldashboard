import { useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, Home, Cloud, Power, BarChart3, HelpCircle } from "lucide-react";

const navItems = [
  { icon: LayoutGrid, path: "/", label: "Dashboard" },
  { icon: Home, path: "/", label: "Home" },
  { icon: Cloud, path: "/config", label: "Config" },
  { icon: Power, path: "/devices", label: "Devices" },
  { icon: BarChart3, path: "/telemetry", label: "Telemetry" },
  { icon: HelpCircle, path: "/help", label: "Help" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
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
