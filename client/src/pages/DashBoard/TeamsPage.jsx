import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Users as UsersIcon,
  FolderKanban,
  MoreVertical,
} from "lucide-react";

export default function TeamsPage() {
  // Dummy array for UI preview (replace with real data later)
  const teams = [
    {
      id: 1,
      name: "Design Team",
      description: "Responsible for UI/UX and brand visuals",
      members: 6,
      projects: 3,
      lead: "John Doe",
      createdAt: "Jan 10, 2024",
      status: "active",
    },
    {
      id: 2,
      name: "Development Team",
      description: "Handles frontend and backend engineering",
      members: 8,
      projects: 5,
      lead: "Sarah",
      createdAt: "Feb 14, 2024",
      status: "active",
    },
    {
      id: 3,
      name: "Development Team",
      description: "Handles frontend and backend engineering",
      members: 8,
      projects: 5,
      lead: "Sarah",
      createdAt: "Feb 14, 2024",
      status: "active",
    },
  ];
  const [filterTeams, setFilterTeams] = useState(teams ? teams : []);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const filterData = teams.filter((team) => {
      return team.name.toLowerCase().includes(searchInput.toLowerCase());
    });

    setFilterTeams(filterData);
    
  }, [searchInput]);

  return (
    <div className="pt-16 md:px-2 lg:px-6 pb-10 space-y-6 p-4 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-2 text-xl font-bold">Teams</h1>
          <p className="text-gray-600">Manage and organize your teams</p>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Create Team
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md  p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            placeholder="Search teams..."
            className="w-full pl-10 pr-4 py-2 shadow-md rounded-md focus:ring-2 ring-blue-500 outline-none"
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Empty State if no teams exist */}
      {filterTeams.length === 0 && (
        <div className="bg-white rounded-lg shadow-md  py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2 text-lg font-semibold">
              No teams found
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first team to get started.
            </p>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center mx-auto gap-2 text-sm hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Create Team
            </button>
          </div>
        </div>
      )}

      {/* Teams Grid */}
      {filterTeams.length > 0 && (
        <div className="grid md:mt-10  grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filterTeams.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="p-6">
                {/* Top Row */}
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <UsersIcon className="w-6 h-6 text-blue-600" />
                  </div>

                  <button className="p-1 hover:bg-gray-100 rounded-md">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Team Name */}
                <h2 className="text-lg font-semibold mt-3">{team.name}</h2>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {team.description}
                </p>

                <div className="mt-6 space-y-4">
                  {/* Team Lead */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                      Team Lead
                    </p>

                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                      <span className="text-sm text-gray-900">{team.lead}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm pt-3 border-t border-gray-300">
                    <div className="flex items-center gap-1 text-gray-600">
                      <UsersIcon className="w-4 h-4" />
                      <span>{team.members} members</span>
                    </div>

                    <div className="flex items-center gap-1 text-gray-600">
                      <FolderKanban className="w-4 h-4" />
                      <span>{team.projects} projects</span>
                    </div>
                  </div>

                  {/* Members Preview (Static UI Circles) */}
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      Members
                    </span>

                    <div className="flex -space-x-2 mt-2">
                      <div className="w-8 h-8 bg-gray-200 border-2 border-white rounded-full overflow-hidden"></div>
                      <div className="w-8 h-8 bg-gray-300 border-2 border-white rounded-full"></div>
                      <div className="w-8 h-8 bg-gray-400 border-2 border-white rounded-full"></div>
                      <div className="w-8 h-8 bg-gray-500 border-2 border-white rounded-full"></div>
                      <div className="w-8 h-8 bg-gray-600 border-2 border-white rounded-full"></div>

                      <div className="w-8 h-8 bg-gray-100 border-2 border-white rounded-full flex items-center justify-center text-xs text-gray-600">
                        +3
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-3 border-t border-gray-300 flex items-center justify-between">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md">
                      {team.status === "active" ? "Active" : "Archived"}
                    </span>

                    <span className="text-xs text-gray-500">
                      Created {team.createdAt}
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
