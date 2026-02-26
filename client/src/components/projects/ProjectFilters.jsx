import { Search } from "lucide-react";
import { useState } from "react";

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ON_HOLD", label: "On Hold" },
  { value: "ARCHIVED", label: "Archived" },
  { value: "ALL", label: "All Projects" },
];

export default function ProjectFilters({
  OnFilter,
  statusFilter,
  onStatusChange,
}) {
  const [inputvalue, setInputValue] = useState("");

  const handleOnChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    OnFilter(value);
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    onStatusChange?.(value);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors duration-200" />
          <input
            value={inputvalue}
            onChange={handleOnChange}
            placeholder="Search projects..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-medium text-gray-700 placeholder:text-gray-400"
          />
        </div>

        <div className="relative w-full sm:w-56">
          <select
            value={statusFilter ?? ""}
            onChange={handleStatusChange}
            className="w-full appearance-none bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option
                key={opt.value || "all"}
                value={opt.value}
                className="font-medium"
              >
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
