import { Search } from "lucide-react";
import { useState } from "react";

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ON_HOLD", label: "On Hold" },
  { value: "ARCHIVED", label: "Archived" },
  { value: "ALL", label: "All Projects" },
];

export default function ProjectFilters({ OnFilter, statusFilter, onStatusChange }) {
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
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            value={inputvalue}
            onChange={handleOnChange}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 shadow-sm rounded-md focus:ring-2 ring-blue-500 outline-none"
          />
        </div>

        {/* Status Filter - drives backend query */}
        <select
          value={statusFilter ?? ""}
          onChange={handleStatusChange}
          className="shadow-sm rounded-md px-3 py-2 text-sm w-full sm:w-48 cursor-pointer border border-gray-200"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
