import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useSelector } from "react-redux";

export default function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
  projectMembers = [],
  defaultStatus = "To Do",
  mode = "create",
  editableData = null,
}) {
  if (!isOpen) return null;

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
        priority: editableData?.priority || "low",
        dueDate: formatDateForInput(editableData?.dueDate),
      });
    }
  }, [mode, editableData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleAssignee = (userId) => {
    setForm((prev) => ({
      ...prev,
      assignees: prev.assignees.includes(userId)
        ? prev.assignees.filter((id) => id !== userId)
        : [...prev.assignees, userId],
    }));
  };

  const handleSubmit = () => {
    onSubmit(form);
  };
  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
      return () => document.body.classList.remove("modal-open");
    }
  }, [isOpen]);

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm modal-backdrop-enter"
        onClick={() => onClose(false)}
      />

      {/* MODAL BOX */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden modal-content-enter">
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditMode ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={() => onClose(false)}
            aria-label="Close create task dialog"
            className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors "
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* BODY */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional description"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          {/* PRIORITY + DUE DATE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full rounded-lg border cursor-pointer border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full rounded-lg border cursor-pointer border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
          </div>

          {/* ASSIGNEES */}
          {!isEditMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign Members <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {projectMembers
                  .filter((member) => member.user)
                  .map((member) => (
                    <label
                      key={member.user._id}
                      className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-200"
                    >
                      <input
                        type="checkbox"
                        checked={form.assignees.includes(member.user._id)}
                        onChange={() => toggleAssignee(member.user._id)}
                      />
                      {/* <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-6 h-6 rounded-full"
                  /> */}
                      <span className="text-sm text-gray-700">
                        {member.user.name}
                      </span>
                    </label>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => onClose(false)}
            className="px-4 py-2 text-sm font-medium cursor-pointer rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-sm font-medium cursor-pointer rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            {isEditMode ? "Edit Task" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
