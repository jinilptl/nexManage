import { Plus, X, Users, Check } from "lucide-react";
import { useEffect } from "react";

function TaskAssignees({
  assignees = [],
  projectMembers = [],
  isAssignMode,
  setIsAssignMode,
  selectedAssignees = [],
  setSelectedAssignees,
  onSave,
  isSaving = false,
  canManage = false,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsAssignMode(false);
      }
    };

    if (isAssignMode) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAssignMode, setIsAssignMode]);

  const openEditor = () => {
    const safeIds = assignees?.map((a) => a?._id).filter(Boolean) || [];
    setSelectedAssignees(safeIds);
    setIsAssignMode(true);
  };

  const toggleAssignee = (userId) => {
    if (!userId) return;

    setSelectedAssignees((prev = []) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const cancelEdit = () => {
    setSelectedAssignees([]);
    setIsAssignMode(false);
  };

  const avatarColors = [
    "bg-indigo-100 text-indigo-700",
    "bg-sky-100 text-sky-700",
    "bg-violet-100 text-violet-700",
    "bg-rose-100 text-rose-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
  ];

  const getAvatarColor = (name) => {
    const idx = (name || "").charCodeAt(0) % avatarColors.length;
    return avatarColors[idx];
  };

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2.5">
          <div className="p-1.5 bg-indigo-50 text-indigo-500 rounded-lg">
            <Users size={14} />
          </div>
          Assignees
          {assignees.length > 0 && (
            <span className="text-[10px] font-semibold text-gray-400 normal-case tracking-normal">
              ({assignees.length})
            </span>
          )}
        </h4>

        {canManage && !isAssignMode && (
          <button
            onClick={openEditor}
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 cursor-pointer"
            title="Manage Assignees"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {!isAssignMode ? (
        <div className="space-y-1.5">
          {Array.isArray(assignees) && assignees.length > 0 ? (
            assignees.map((u, i) => (
              <div
                key={u?._id || i}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-200"
              >
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ring-2 ring-white ${getAvatarColor(u?.name)}`}>
                  {u?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-sm text-gray-700 font-medium truncate block">
                    {u?.name || "Unknown"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-5 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
              <Users size={18} className="text-gray-300 mb-1.5" />
              <p className="text-xs text-gray-400 font-medium">No assignees yet</p>
            </div>
          )}
        </div>
      ) : (
        <div className="relative z-20">
          <div
            className="fixed inset-0 z-10 bg-black/10 backdrop-blur-[1px]"
            onClick={cancelEdit}
          />

          <div className="relative z-20 w-full bg-white rounded-xl shadow-xl border border-gray-200 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h3 className="text-sm font-semibold text-gray-900">
                Manage Assignees
              </h3>
              <button
                onClick={cancelEdit}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto p-2 scrollbar-hide">
              {Array.isArray(projectMembers) && projectMembers.length > 0 ? (
                <div className="space-y-0.5">
                  {projectMembers
                    .filter(
                      (member) =>
                        member.roleInProject !== "observer" &&
                        !member?.user?.isTempMember,
                    )
                    .map((member) => {
                      const userId = member?.user?._id;
                      if (!userId) return null;

                      const isSelected = selectedAssignees?.includes(userId);

                      return (
                        <label
                          key={userId}
                          className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200 border ${isSelected
                              ? "bg-indigo-50 border-indigo-100"
                              : "hover:bg-gray-50 border-transparent"
                            }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 shrink-0 ${isSelected
                                ? "bg-indigo-600 border-indigo-600"
                                : "border-gray-300 bg-white"
                              }`}
                          >
                            {isSelected && (
                              <Check size={12} className="text-white" strokeWidth={3} />
                            )}
                          </div>

                          <input
                            type="checkbox"
                            className="hidden"
                            checked={isSelected}
                            onChange={() => toggleAssignee(userId)}
                          />

                          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ring-2 ring-white shrink-0 ${getAvatarColor(member?.user?.name)}`}>
                            {member?.user?.name?.[0]?.toUpperCase() || "U"}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {member?.user?.name || "Unknown"}
                            </div>
                            <div className="text-[11px] text-gray-500 truncate capitalize">
                              {member?.roleInProject || "Member"}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No project members found.
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between gap-2">
              <span className="text-[11px] text-gray-400 font-medium">
                {selectedAssignees.length} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={onSave}
                  disabled={isSaving}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default TaskAssignees;
