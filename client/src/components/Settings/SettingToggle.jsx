import React from "react";

export default function SettingToggle({ title, desc, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-3">
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>

      <button
        onClick={onToggle}
        className={`w-12 h-6 flex items-center rounded-full px-1 transition ${
          enabled ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`w-4 h-4 bg-white rounded-full transition transform ${
            enabled ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
