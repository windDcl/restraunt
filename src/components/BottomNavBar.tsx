import { Home, Search, ReceiptText, User } from "lucide-react";
import { TabType } from "../types";

interface BottomNavBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function BottomNavBar({
  activeTab,
  onTabChange,
}: BottomNavBarProps) {
  const navItems = [
    { id: "Home" as TabType, label: "Home", icon: Home },
    { id: "Search" as TabType, label: "Search", icon: Search },
    { id: "Orders" as TabType, label: "Orders", icon: ReceiptText },
    { id: "Profile" as TabType, label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 py-3 pb-safe-and-more bg-surface border-t border-surface-container-highest shadow-[0_-4px_12px_rgba(0,0,0,0.04)] rounded-t-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-xl transition-all duration-300 ${
              isActive
                ? "text-primary bg-primary-container/10 font-bold"
                : "text-on-surface-variant hover:text-primary active:scale-95"
            }`}
          >
            <Icon className={`w-5.5 h-5.5 ${isActive ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
            <span className="text-[11px] font-sans font-medium mt-1">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
