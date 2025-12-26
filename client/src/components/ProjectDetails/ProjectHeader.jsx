import React from "react";
import { Share2, Settings } from "lucide-react";

export default function ProjectHeader({ project }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div className="flex gap-4 min-w-0">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
          🌐
        </div>

        {/* Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900 truncate max-w-[60vw]">
              {project.projectName}
            </h1>
            <span className="px-3 py-1 text-xs rounded-full bg-black text-white">
              {project.status}
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-1">{project.description}</p>

          {/* Members */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex -space-x-2">
              {project.projectMembers?.map((m) => (
                <div
                
                  className="w-8 h-8 text-xl rounded-full border-2 border-white text-center bg-amber-500"
                >{m.user.name[0].toUpperCase()}</div>
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {project.projectMembers.length} members
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 shrink-0">
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm bg-white hover:bg-gray-100">
          <Share2 size={16} />
          Share
        </button>
        <button className="p-2 border rounded-lg bg-white hover:bg-gray-100">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}
