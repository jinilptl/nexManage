import React from "react";

export default function SettingsLayout({ title, subtitle, children }) {
  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900"></h1>
          <p className="text-sm text-gray-600 mt-1"></p>
        </div>
                <div>
          <h1 className="text-gray-900  text-2xl font-bold">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  );
}
