import SectionCard from "./SectionCard";
import { FolderKanban } from "lucide-react";

export default function ProjectProgress({ projects = [] }) {
  const badgeClasses = (type) => {
    if (type === "success") return "bg-green-100 text-green-700";
    if (type === "warning") return "bg-yellow-100 text-yellow-700";
    if (type === "danger") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <SectionCard
      title="Project Progress"
      subtitle="Completion status across all active projects"
    >
      <div className="space-y-6">
        {projects.map((project, index) => {
          const totalTasks = project?.stats?.totalTasks ?? 0;
          const completedTasks = project?.stats?.completedTasks ?? 0;

          const progress = totalTasks
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;

          const status =
            progress >= 75 ? "success" : progress >= 50 ? "warning" : "danger";

          const statusText =
            progress >= 75 ? "On Track" : progress >= 50 ? "At Risk" : "Behind";

          return (
            <div key={project?.id || index} className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl">
                    {<FolderKanban className="w-6 h-6" />}
                  </span>

                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {project?.name ?? "Unnamed Project"}
                    </h4>

                    <p className="text-xs text-gray-500">
                      {completedTasks} of {totalTasks} tasks completed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {progress}%
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${badgeClasses(
                      status,
                    )}`}
                  >
                    {statusText}
                  </span>
                </div>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
