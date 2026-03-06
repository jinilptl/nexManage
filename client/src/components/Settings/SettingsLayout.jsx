import React from "react";

export default function SettingsLayout({ title, subtitle, children }) {
  return (
    <div className="pt-5 px-4 md:px-2 pb-10 space-y-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-gray-900 text-2xl font-bold">{title}</h1>
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  );
}
