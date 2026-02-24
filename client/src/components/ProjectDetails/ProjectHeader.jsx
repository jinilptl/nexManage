import { Layout, Users, Calendar, CheckCircle2, AlertCircle, Archive, Clock } from "lucide-react";
import Avatar from "../common/Avatar";

export default function ProjectHeader({ project }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "ACTIVE":
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-700",
          border: "border-emerald-200",
          icon: CheckCircle2
        };
      case "COMPLETED":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: CheckCircle2
        };
      case "ON_HOLD":
        return {
          bg: "bg-amber-100",
          text: "text-amber-700",
          border: "border-amber-200",
          icon: AlertCircle
        };
      case "ARCHIVED":
        return {
          bg: "bg-slate-100",
          text: "text-slate-700",
          border: "border-slate-200",
          icon: Archive
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: Clock
        };
    }
  };

  const statusStyle = getStatusStyle(project.status);
  const StatusIcon = statusStyle.icon;

  // Format date if available
  const formattedDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : null;

  // Filter out temp/invited observers who haven't registered yet
  const confirmedMembers = (project.projectMembers || []).filter(
    (m) => m.user && !m.user.isTempMember
  );

  return (
    <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex gap-5 min-w-0 flex-1">
          {/* Project Icon */}
          <div className="shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <Layout className="w-8 h-8" />
            </div>
          </div>

          {/* Project Details */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight truncate">
                {project.projectName}
              </h1>
              <span
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {project.status?.replace("_", " ")}
              </span>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed max-w-2xl mb-4 line-clamp-2">
              {project.description || "No description provided for this project."}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span>
                  {confirmedMembers.length} Member
                  {confirmedMembers.length !== 1 ? "s" : ""}
                </span>
              </div>
              {formattedDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Created {formattedDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Members Avatars */}
        {confirmedMembers.length > 0 && (
          <div className="flex flex-col items-end gap-2 md:self-center shrink-0">
            <div className="flex -space-x-3">
              {confirmedMembers.slice(0, 5).map((m, index) => (
                <Avatar
                  key={index}
                  user={m.user}
                  className="w-10 h-10 text-sm border-2 border-white shadow-sm ring-2 ring-white transition-transform hover:-translate-y-1 z-0 hover:z-10"
                />
              ))}
              {confirmedMembers.length > 5 && (
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-bold shadow-sm ring-2 ring-white z-0">
                  +{confirmedMembers.length - 5}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
