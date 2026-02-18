import React from "react";
import { User, ShieldCheck, Bell, Palette, CreditCard, AlertTriangle } from "lucide-react";

export default function SettingsSidebar({ tabs, activeTab, onChangeTab }) {
  const getIcon = (key) => {
    switch (key) {
      case "account": return <User size={18} />;
      case "security": return <ShieldCheck size={18} />;
      case "notifications": return <Bell size={18} />;
      case "appearance": return <Palette size={18} />;
      case "billing": return <CreditCard size={18} />;
      case "danger": return <AlertTriangle size={18} />;
      default: return <User size={18} />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm h-full">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
        Menu
      </h3>
      <div className="space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChangeTab(tab.key)}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 ${activeTab === tab.key
                ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
          >
            {getIcon(tab.key)}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
