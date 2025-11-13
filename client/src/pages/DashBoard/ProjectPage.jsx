import React from "react";
import {
  Plus,
  Search,
  Target,
  Users as UsersIcon,
  Calendar,
  MoreVertical,
} from "lucide-react";

export default function ProjectPage() {
  // Dummy Array (replace with API or actual data later)
  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      description: "Complete overhaul of website UI/UX",
      progress: 65,
      tasksCompleted: 26,
      tasksTotal: 40,
      members: 5,
      endDate: "Aug 14, 2025",
      status: "Active",
      color: "#3b82f6",
    },
    {
      id: 2,
      name: "Mobile App",
      description: "Developing a new mobile app for customers",
      progress: 45,
      tasksCompleted: 18,
      tasksTotal: 40,
      members: 8,
      endDate: "Sep 11, 2025",
      status: "On Hold",
      color: "#10b981",
    },
    {
      id: 3,
      name: "Mobile App",
      description: "Developing a new mobile app for customers",
      progress: 45,
      tasksCompleted: 18,
      tasksTotal: 40,
      members: 8,
      endDate: "Sep 11, 2025",
      status: "On Hold",
      color: "#10b981",
    },
  ];

  return (
    <div className="pt-16 md:px-2 lg:px-6  px-4  pb-10 space-y-6 p-4 md:p-6 ">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-2 text-2xl font-bold">Projects</h1>
          <p className="text-gray-600">Manage and track all your projects</p>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Create Project
        </button>
      </div>

      {/* Filters + Search UI (No logic, UI only) */}
      <div className="bg-white rounded-lg shadow-md  p-6">
        <div className="flex flex-col sm:flex-row gap-4">

          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2  shadow-sm rounded-md focus:ring-2 ring-blue-500 outline-none"
            />
          </div>

          {/* Placeholder select (UI only) */}
          <select className=" shadow-sm rounded-md px-3 py-2 text-sm w-full sm:w-48">
            <option>Status</option>
            <option>Active</option>
            <option>Completed</option>
            <option>On Hold</option>
            <option>Archived</option>
          </select>
        </div>
      </div>

      {/* EMPTY STATE */}
      {projects.length === 0 && (
        <div className="bg-white rounded-lg shadow-md  py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2 text-lg font-semibold">No projects found</h3>
            <p className="text-gray-600 mb-6">
              Create your first project to get started.
            </p>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center mx-auto gap-2 text-sm hover:bg-blue-700">
              <Plus className="w-4 h-4" /> Create Project
            </button>
          </div>
        </div>
      )}

      {/* PROJECTS GRID (Uses .map) */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:mt-13">

          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-lg transition"
            >
              <div className="p-6">

                {/* Header */}
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: p.color + "20" }}
                  >
                    <Target className="w-6 h-6" />
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded-md">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Title + Desc */}
                <h2 className="text-lg font-semibold mt-3">{p.name}</h2>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {p.description}
                </p>

                <div className="mt-6 space-y-4">

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-gray-900">{p.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-blue-600 rounded-full"
                        style={{ width: `${p.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Target className="w-4 h-4" />
                      <span>
                        {p.tasksCompleted}/{p.tasksTotal} Tasks
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{p.endDate}</span>
                    </div>
                  </div>

                  {/* Members + Status */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                      <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                      <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white"></div>
                      {p.members > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">
                          +{p.members - 3}
                        </div>
                      )}
                    </div>

                    <span
                      className="px-2 py-1 text-xs rounded-md"
                      style={{
                        backgroundColor: "#e0f2fe",
                        color: "#0284c7",
                      }}
                    >
                      {p.status}
                    </span>
                  </div>

                </div>
              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}
