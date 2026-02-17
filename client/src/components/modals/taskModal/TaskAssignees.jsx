import { Plus, X } from "lucide-react";
function TaskAssignees({
  assignees,
  projectMembers,
  isAssignMode,
  setIsAssignMode,
  selectedAssignees,
  setSelectedAssignees,
  onSave,
  isSaving,
  canManage,
}) {
  // open edit mode
  const openEditor = () => {
    setSelectedAssignees(assignees.map((a) => a._id));
    setIsAssignMode(true);
  };

  // toggle checkbox
  const toggleAssignee = (userId) => {
    setSelectedAssignees((prev) =>
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
    <section className="mb-6">
      <h4 className="mb-2 text-xs font-semibold uppercase text-gray-500">
        Assignees
      </h4>

      {/* ===== VIEW MODE ===== */}
      {!isAssignMode && (
        <div className="flex flex-wrap gap-2">
          {assignees.map((u, i) => (
            <div
              key={i}
              title={u.name}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700"
            >
              {u.name?.[0]?.toUpperCase()}
            </div>
          ))}

          {canManage && (
            <button
              onClick={openEditor}
              className="flex h-8 w-8 items-center cursor-pointer justify-center rounded-full border text-gray-500 hover:bg-gray-100 transition-all hover:border-blue-300 hover:text-blue-600"
              title="Edit assignees"
            >
              <Plus size={14} />
            </button>
          )}
        </div>
      )}

      {/* ===== EDIT MODE ===== */}
      {isAssignMode && (
        <div className="mt-2 rounded-xl border border-gray-300 bg-white shadow-lg">
          {/* HEADER */}
          <div className="flex items-center justify-between border-b px-4 py-2">
            <span className="text-sm font-semibold">Select assignees</span>
            <button onClick={cancelEdit}>
              <X size={16} />
            </button>
          </div>

          {/* LIST */}
          <div className="max-h-60 overflow-y-auto p-2">
            {projectMembers.map((member) => (
              <label
                key={member.user._id}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedAssignees.includes(member.user._id)}
                  onChange={() => toggleAssignee(member.user._id)}
                />

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  {member.user.name?.[0]?.toUpperCase()}
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {member.user.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {member.roleInProject}
                  </span>
                </div>
              </label>
            ))}

            {projectMembers.length === 0 && (
              <p className="px-3 py-2 text-sm text-gray-400">
                No project members
              </p>
            )}
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-2 border-t px-4 py-3">
            <button
              onClick={cancelEdit}
              className="rounded-lg bg-gray-200 cursor-pointer px-4 py-1.5 text-sm"
            >
              Cancel
            </button>

            <button
              onClick={onSave}
              disabled={isSaving}
              className="rounded-lg bg-blue-600 px-4 py-1.5 cursor-pointer text-sm text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}


export default TaskAssignees
