import { MoreVertical, Users, Calendar } from "lucide-react";

export default function ProjectCard({ project }) {
  const membersCount = project.projectMembers?.length || 0;

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition">
      <div className="p-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <MoreVertical className="text-gray-500 cursor-pointer" />
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold mt-3">{project.projectName}</h2>

        {/* Description */}
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {project.description || "No description provided"}
        </p>

        <div className="mt-6 space-y-4">

          {/* Created At */}
          <div className="flex items-center text-gray-600 gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(project.createdAt).toLocaleDateString("en-IN")}
            </span>
          </div>

          {/* Members Count */}
          <div className="flex items-center justify-between pt-4 border-t">
            <span className="text-sm text-gray-700">
              {membersCount} Members
            </span>

            {/* Status Badge */}
            <span
              className={`px-2 py-1 text-xs rounded-md capitalize ${
                project.status === "active"
                  ? "bg-green-100 text-green-700"
                  : project.status === "onhold"
                  ? "bg-yellow-100 text-yellow-700"
                  : project.status === "completed"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {project.status}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
