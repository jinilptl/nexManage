import React from "react";

export default function MetricCard({ title, value, icon, footer }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{title}</p>
        {icon}
      </div>

      <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>

      {footer ? <div>{footer}</div> : null}
    </div>
  );
}
