import React from "react";

export default function SettingsSidebar({ tabs, activeTab, onChangeTab }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 space-y-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChangeTab(tab.key)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === tab.key
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
