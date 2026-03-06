import React from "react";
import { User, ShieldCheck } from "lucide-react";

const TAB_CONFIG = {
  account: {
    icon: User,
    color: "text-blue-600",
    bg: "bg-blue-50",
    activeBg: "bg-blue-50",
    activeText: "text-blue-700",
    activeRing: "ring-blue-100",
    dot: "bg-blue-500",
  },
  security: {
    icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    activeBg: "bg-emerald-50",
    activeText: "text-emerald-700",
    activeRing: "ring-emerald-100",
    dot: "bg-emerald-500",
  },
};

export default function SettingsSidebar({ tabs, activeTab, onChangeTab }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">
        Navigation
      </p>
      <div className="space-y-1">
        {tabs.map((tab) => {
          const config = TAB_CONFIG[tab.key] || TAB_CONFIG.account;
          const Icon = config.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onChangeTab(tab.key)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 group ${isActive
                  ? `${config.activeBg} ${config.activeText} ring-1 ${config.activeRing} shadow-sm`
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${isActive
                    ? `${config.bg} ${config.color}`
                    : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                  }`}
              >
                <Icon size={16} />
              </div>
              <span className="flex-1">{tab.label}</span>
              {isActive && (
                <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
