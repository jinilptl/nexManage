import { useState, useEffect } from "react";
import { MoreVertical, Users, Calendar } from "lucide-react";

export default function ProjectCard({
  project,
  onView,
  onArchive,
  onDelete,
  loading,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = () => setMenuOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  const membersCount = project.projectMembers?.length || 0;

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition relative">
      <div className="p-6">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>

          {/* MENU BUTTON */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              disabled={loading}
              className={`p-1 rounded-md ${
                loading ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (!loading) setMenuOpen(!menuOpen);
              }}
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>

            {/* DROPDOWN */}
            {menuOpen && !loading && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg z-50 animate-fadeIn">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => {
                    onView(project);
                    setMenuOpen(false);
                  }}
                >
                  View Project
                </button>

                <div className="border-t my-1"></div>

                <button
                  className="w-full text-left px-4 py-2 text-yellow-600 hover:bg-gray-100 text-sm"
                  onClick={() => {
                    onArchive(project);
                    setMenuOpen(false);
                  }}
                >
                  Archive Project
                </button>
              </div>
            )}
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-lg font-semibold mt-3">{project.projectName}</h2>

        {/* DESC */}
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {project.description || "No description provided"}
        </p>

        {/* METADATA */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center text-gray-600 gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(project.createdAt).toLocaleDateString("en-IN")}
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <span className="text-sm text-gray-700">
              {membersCount} Members
            </span>

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
