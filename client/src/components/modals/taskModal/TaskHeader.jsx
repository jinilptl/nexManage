import { X, Pencil, Trash2, Calendar, Flag, ArrowRight } from "lucide-react";

const priorityConfig = {
  critical: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
    label: "Critical",
  },
  high: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    dot: "bg-orange-500",
    label: "High",
  },
  medium: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    label: "Medium",
  },
  low: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    label: "Low",
  },
};

const statusConfig = {
  "to do": "bg-slate-100 text-slate-600 border-slate-200",
  "in progress": "bg-blue-50 text-blue-600 border-blue-200",
  review: "bg-purple-50 text-purple-600 border-purple-200",
  done: "bg-emerald-50 text-emerald-600 border-emerald-200",
  completed: "bg-emerald-50 text-emerald-600 border-emerald-200",
};

export default function TaskHeader({
  task,
  canManage,
  onEdit,
  onDelete,
  onClose,
}) {
  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const statusKey = (task.status || "").toLowerCase();
  const statusClasses = statusConfig[statusKey] || "bg-gray-100 text-gray-600 border-gray-200";

  const formatDueDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const now = new Date();
    const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));

    const formatted = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (diff < 0) return { text: `${formatted} (Overdue)`, isOverdue: true };
    if (diff === 0) return { text: `${formatted} (Today)`, isOverdue: false };
    if (diff <= 3) return { text: `${formatted} (${diff}d left)`, isOverdue: false };
    return { text: formatted, isOverdue: false };
  };

  const dueInfo = formatDueDate(task.dueDate);

  return (
    <div className="space-y-4">
      {/* Top bar — Close + Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-lg border border-gray-100 uppercase tracking-widest select-none">
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            Task-{task._id.slice(-6).toUpperCase()}
          </span>

          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-lg border capitalize ${statusClasses}`}>
            {task.status}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {canManage && (
            <>
              <button
                onClick={onEdit}
                className="group inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 hover:border-indigo-200 cursor-pointer transition-all duration-200"
              >
                <Pencil size={13} className="group-hover:rotate-[-8deg] transition-transform duration-200" />
                Edit
              </button>

              <button
                onClick={onDelete}
                className="group inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 cursor-pointer transition-all duration-200"
              >
                <Trash2 size={13} className="group-hover:scale-110 transition-transform duration-200" />
                Delete
              </button>
            </>
          )}

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer transition-all duration-200 ml-1"
            aria-label="Close task details"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight tracking-tight">
          {task.title}
        </h2>
      </div>

      {/* Meta chips */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Priority badge */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-lg border ${priority.bg} ${priority.text} ${priority.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          {priority.label}
        </span>

        {/* Due date */}
        {dueInfo && (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-lg border ${dueInfo.isOverdue
              ? "bg-red-50 text-red-600 border-red-200"
              : "bg-gray-50 text-gray-600 border-gray-200"
            }`}>
            <Calendar size={12} />
            {dueInfo.text}
          </span>
        )}
      </div>
    </div>
  );
}
