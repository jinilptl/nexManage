import { Plus, X } from "lucide-react";
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

  // Close on ESC key
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
    const safeIds =
      assignees?.map((a) => a?._id).filter(Boolean) || [];
    setSelectedAssignees(safeIds);
    setIsAssignMode(true);
  };

  const toggleAssignee = (userId) => {
    if (!userId) return;

    setSelectedAssignees((prev = []) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const cancelEdit = () => {
    setSelectedAssignees([]);
    setIsAssignMode(false);
  };

  return (
    <section className="mb-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
          Assignees
        </h4>

        {canManage && !isAssignMode && (
          <button
            onClick={openEditor}
            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Manage Assignees"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* ================= VIEW MODE ================= */}
      {!isAssignMode ? (
        <div className="flex flex-wrap gap-2">
          {Array.isArray(assignees) && assignees.length > 0 ? (
            assignees.map((u, i) => (
              <div
                key={u?._id || i}
                title={u?.name}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-gray-50 border border-gray-200"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700 ring-2 ring-white">
                  {u?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-sm text-gray-700 font-medium truncate max-w-[100px]">
                  {u?.name || "Unknown"}
                </span>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-400 italic px-2">
              No assignees yet
            </div>
          )}
        </div>
      ) : (
        /* ================= EDIT MODE ================= */
        <div className="relative z-20">

          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10 bg-black/10 backdrop-blur-[1px]"
            onClick={cancelEdit}
          />

          {/* Modal */}
          <div className="relative z-20 w-full bg-white rounded-xl shadow-xl border border-gray-200 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
              <h3 className="text-sm font-semibold text-gray-900">
                Manage Assignees
              </h3>
              <button
                onClick={cancelEdit}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-gray-200/50 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Members List */}
            <div className="max-h-64 overflow-y-auto p-2">
              {Array.isArray(projectMembers) && projectMembers.length > 0 ? (
                <div className="space-y-1">
                  {projectMembers.map((member) => {
                    const userId = member?.user?._id;
                    if (!userId) return null;

                    const isSelected =
                      selectedAssignees?.includes(userId);

                    return (
                      <label
                        key={userId}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all border ${
                          isSelected
                            ? "bg-blue-50 border-blue-100"
                            : "hover:bg-gray-50 border-transparent"
                        }`}
                      >
                        {/* Custom Checkbox */}
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-blue-600 border-blue-600"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && (
                            <Plus
                              size={12}
                              className="text-white rotate-45"
                            />
                          )}
                        </div>

                        {/* Hidden real checkbox */}
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={isSelected}
                          onChange={() => toggleAssignee(userId)}
                        />

                        {/* Avatar */}
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 ring-2 ring-white">
                          {member?.user?.name?.[0]?.toUpperCase() || "U"}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {member?.user?.name || "Unknown"}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
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

            {/* Footer */}
            <div className="p-3 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex items-center justify-end gap-2">
              <button
                onClick={cancelEdit}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200/50 rounded-lg transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={onSave}
                disabled={isSaving}
                className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Done"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default TaskAssignees;
