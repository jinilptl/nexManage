import React from "react";

export default function SectionCard({ title, subtitle, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="mb-3">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {subtitle ? <p className="text-sm text-gray-500">{subtitle}</p> : null}
      </div>

      {children}
    </div>
  );
}
