import { Clock, CheckCircle, ArrowRight, Edit, Trash2, Paperclip, UserPlus } from "lucide-react";

const actionIcons = {
  created: CheckCircle,
  updated: Edit,
  deleted: Trash2,
  attachment: Paperclip,
  assigned: UserPlus,
  moved: ArrowRight,
};

const actionColors = {
  created: "bg-emerald-50 text-emerald-500 border-emerald-100",
  updated: "bg-blue-50 text-blue-500 border-blue-100",
  deleted: "bg-red-50 text-red-500 border-red-100",
  attachment: "bg-amber-50 text-amber-500 border-amber-100",
  assigned: "bg-violet-50 text-violet-500 border-violet-100",
  moved: "bg-indigo-50 text-indigo-500 border-indigo-100",
};

function getActionType(actionText) {
  const lower = (actionText || "").toLowerCase();
  if (lower.includes("created") || lower.includes("added")) return "created";
  if (lower.includes("deleted") || lower.includes("removed")) return "deleted";
  if (lower.includes("updated") || lower.includes("changed") || lower.includes("edited")) return "updated";
  if (lower.includes("attached") || lower.includes("upload")) return "attachment";
  if (lower.includes("assigned")) return "assigned";
  if (lower.includes("moved") || lower.includes("status")) return "moved";
  return "updated";
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function TaskActivity({ activities }) {
  return (
    <section>
      <h4 className="mb-4 text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2.5">
        <div className="p-1.5 bg-gray-100 text-gray-500 rounded-lg">
          <Clock size={14} />
        </div>
        Activity
        {activities?.length > 0 && (
          <span className="text-[10px] font-semibold text-gray-400 normal-case tracking-normal">
            ({activities.length})
          </span>
        )}
      </h4>

      <div className="relative">
        {activities?.length > 0 ? (
          <div className="space-y-0">
            {activities.map((a, i) => {
              const type = getActionType(a.action);
              const Icon = actionIcons[type] || CheckCircle;
              const colorClasses = actionColors[type] || actionColors.updated;

              return (
                <div key={i} className="flex gap-3 group relative">
                  {/* Timeline line */}
                  {i < activities.length - 1 && (
                    <div className="absolute top-8 left-[13px] w-[2px] h-[calc(100%-8px)] bg-gray-100 group-hover:bg-gray-200 transition-colors" />
                  )}

                  {/* Icon */}
                  <div className="relative z-10 shrink-0">
                    <div className={`h-7 w-7 rounded-lg flex items-center justify-center border ${colorClasses} transition-colors`}>
                      <Icon size={13} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-5">
                    <p className="text-xs font-medium text-gray-700 leading-relaxed">
                      {a.action}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-400 font-medium">
                        {a.performedBy?.name || "System"}
                      </span>
                      {a.createdAt && (
                        <>
                          <span className="text-gray-200">·</span>
                          <span className="text-[10px] text-gray-400">
                            {timeAgo(a.createdAt)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <Clock size={18} className="text-gray-300 mb-1.5" />
            <p className="text-xs text-gray-400 font-medium">No activity yet</p>
          </div>
        )}
      </div>
    </section>
  );
}
