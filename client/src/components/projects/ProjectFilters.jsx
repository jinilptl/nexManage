import { Search } from "lucide-react";

export default function ProjectFilters() {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 shadow-sm rounded-md focus:ring-2 ring-blue-500 outline-none"
          />
        </div>

        {/* Status Filter */}
        <select className="shadow-sm rounded-md px-3 py-2 text-sm w-full sm:w-48">
          <option value="">Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="onhold">On Hold</option>
          <option value="archived">Archived</option>
        </select>

      </div>
    </div>
  );
}
