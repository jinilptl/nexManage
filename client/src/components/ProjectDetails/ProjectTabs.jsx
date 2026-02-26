import React from "react";

const TABS = ["board", "list"];

export default function ProjectTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex gap-6 bg-gray-200 rounded-full px-4 py-2 w-fit mb-8">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-1.5 rounded-full text-sm capitalize transition cursor-pointer ${
            activeTab === tab
              ? "bg-white shadow text-gray-900 font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
