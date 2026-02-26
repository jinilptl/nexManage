import React from "react";

export default function SettingToggle({
  title,
  desc,
  enabled,
  onToggle,
  icon,
}) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors shadow-sm">
      <div className="flex items-center gap-4">
        {icon && (
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            {icon}
          </div>
        )}
        <div className="space-y-0.5">
          <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
      </div>

      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
          enabled ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
