import SectionCard from "./SectionCard";
import { FolderKanban, CheckCircle2, AlertCircle } from "lucide-react";

export default function ProjectProgress({
  projects = [],
  footer = null,
  gridClassName = "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-2",
}) {
  const getStatusColor = (progress) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 40) return "bg-blue-500";
    return "bg-amber-500";
  };

  const getStatusText = (progress) => {
    if (progress >= 75)
      return { text: "On Track", color: "text-green-600", bg: "bg-green-50" };
    if (progress >= 40)
      return {
        text: "In Progress",
        color: "text-blue-600",
        bg: "bg-blue-50",
      };
    return { text: "At Risk", color: "text-amber-600", bg: "bg-amber-50" };
  };

  return (
    <SectionCard
      title="Project Progress"
      subtitle="Completion status across all active projects"
    >
      <div className={gridClassName}>
        {projects.length === 0 && (
          <p className="text-sm text-gray-500 col-span-full">
            No active projects found.
          </p>
        )}
        {projects.map((project, index) => {
          const totalTasks = project?.stats?.totalTasks ?? 0;
          const completedTasks = project?.stats?.completedTasks ?? 0;
          const progress = totalTasks
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;

          const status = getStatusText(progress);

          return (
            <div
              key={project?.id || index}
              className="group border border-gray-100 bg-gray-50/50 rounded-xl p-4 hover:shadow-md hover:border-gray-200 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                    <FolderKanban className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">
                      {project?.name ?? "Unnamed Project"}
                    </h4>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${status.bg} ${status.color}`}
                    >
                      {status.text}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-800">
                    {progress}%
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${getStatusColor(
                      progress,
                    )}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    {completedTasks} done
                  </span>
                  <span className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-gray-400" />
                    {totalTasks - completedTasks} remaining
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {footer}
    </SectionCard>
  );
}
