import React from "react";

export default function SettingsLayout({ title, subtitle, children }) {
  return (
    <div className="p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  );
}
