import React from "react";

export default function PageHeader({ title, subtitle }) {
  return (
    <div>
      <h1 className="text-gray-900 text-2xl font-bold mb-1">{title}</h1>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
  );
}
