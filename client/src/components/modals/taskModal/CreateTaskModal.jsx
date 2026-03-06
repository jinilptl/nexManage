import React, { useEffect, useState } from "react";
import {
  X, ClipboardList, Type, AlignLeft, Zap, Calendar,
  Users, CheckSquare, Loader2, PenLine,
} from "lucide-react";
import { useSelector } from "react-redux";
import useScrollLock from "../../../hooks/useScrollLock";
import Avatar from "../../common/Avatar";

const PRIORITY_CONFIG = {
  low: { label: "Low", cls: "bg-gray-100 text-gray-600 border-gray-200", dot: "bg-gray-400" },
  medium: { label: "Medium", cls: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  high: { label: "High", cls: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  critical: { label: "Critical", cls: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
};

export default function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
  projectMembers = [],
  defaultStatus = "To Do",
  mode = "create",
  editableData = null,
}) {
  const isEditMode = mode === "edit";

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignees: [],
    dueDate: "",
    status: defaultStatus,
  });

  const formatDateForInput = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  useEffect(() => {
    if (mode === "edit" && editableData) {
      setForm({
        title: editableData?.title || "",
        description: editableData?.description || "",
        priority: editableData?.priority || "medium",
        dueDate: formatDateForInput(editableData?.dueDate),
        assignees: [],
        status: defaultStatus,
      });
    }
  }, [mode, editableData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleAssignee = (userId) => {
    setForm((prev) => ({
      ...prev,
      assignees: prev.assignees.includes(userId)
        ? prev.assignees.filter((id) => id !== userId)
        : [...prev.assignees, userId],
    }));
  };

  useScrollLock(isOpen);
  if (!isOpen) return null;

  const assignableMembers = projectMembers.filter(
    (m) => m.user && m.roleInProject !== "observer" && !m.user.isTempMember
  );

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => onClose(false)} />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: "92vh" }}>
        <div className="bg-linear-to-br from-violet-600 via-violet-700 to-purple-800 px-5 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
                <ClipboardList size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-sm">
                  {isEditMode ? "Edit Task" : "Create Task"}
                </h2>
                <p className="text-violet-200 text-xs">
                  {isEditMode ? "Update task details" : "Add a new task to the board"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onClose(false)}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
              <Type size={13} className="text-gray-400" />
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter a clear, concise task title…"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
              <AlignLeft size={13} className="text-gray-400" />
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add more context, acceptance criteria, or notes…"
              rows={3}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                <Zap size={13} className="text-gray-400" />
                Priority
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(PRIORITY_CONFIG).map(([val, cfg]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, priority: val }))}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${form.priority === val
                        ? `${cfg.cls} ring-1 ring-offset-1 ring-current`
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                      }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${form.priority === val ? cfg.dot : "bg-gray-300"}`} />
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                <Calendar size={13} className="text-gray-400" />
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all cursor-pointer"
              />
            </div>
          </div>

          {!isEditMode && (
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                <Users size={13} className="text-gray-400" />
                Assign Members
                {form.assignees.length > 0 && (
                  <span className="ml-auto text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">
                    {form.assignees.length} selected
                  </span>
                )}
              </label>

              {assignableMembers.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <Users size={20} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No members available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                  {assignableMembers.map((member) => {
                    const selected = form.assignees.includes(member.user._id);
                    return (
                      <label
                        key={member.user._id}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${selected
                            ? "bg-violet-50 border-violet-300 ring-1 ring-violet-200"
                            : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleAssignee(member.user._id)}
                          className="sr-only"
                        />
                        <Avatar user={member.user} className="w-7 h-7 text-[10px] shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">{member.user.name}</p>
                          <p className="text-[10px] text-gray-400 capitalize truncate">{member.roleInProject}</p>
                        </div>
                        {selected && (
                          <CheckSquare size={14} className="text-violet-600 ml-auto shrink-0" />
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="shrink-0 px-5 py-4 border-t border-gray-100 bg-gray-50/60 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => onClose(false)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSubmit(form)}
            className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-violet-200"
          >
            <PenLine size={14} />
            {isEditMode ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
