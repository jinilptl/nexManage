import React, { useEffect, useState } from "react";
import {
  X,
  Paperclip,
  Trash2,
  Pencil,
  Plus,
  CheckCircle,
  Download,
  Satellite,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateAssigneesTaskService } from "../../../services/taskOperations/taskServices";

export default function TaskDetailModal({ task, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [description, setDescription] = useState(task.description || "");

  const [subtasks, setSubtasks] = useState(
    task.subtasks || [
      { title: "Design UI", completed: true },
      { title: "Implement modal", completed: false },
    ]
  );
  const [newSubtask, setNewSubtask] = useState("");

  const [attachments, setAttachments] = useState(
    task.attachments || [{ name: "design.png", size: "1.2MB", url: "#" }]
  );

  const [assignees, setAssignees] = useState(task.assignees || []);
  const [isAssignMode, setIsAssignMode] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [isSavingAssignees, setIsSavingAssignees] = useState(false);

  const project = useSelector((state) => state.projects.selectedProject);
  const allTaskAssignee = useSelector((state) => state.tasks.selectedTask.data.assignees);
  const projectMembers = project?.data?.projectMembers || [];

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks([...subtasks, { title: newSubtask, completed: false }]);
    setNewSubtask("");
  };

  const handleDeleteSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleAttachmentAdd = (e) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setAttachments([
      ...attachments,
      {
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        url: "#",
      },
    ]);
  };

  // -------- ASSIGNEE EDIT FLOW --------
  const openAssigneeEditor = () => {
    setSelectedAssignees(assignees.map((a) => a._id));
    setIsAssignMode(true);
  };

  const toggleAssignee = (userId) => {
    setSelectedAssignees((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const handleSaveAssignees = async () => {
    try {
      setIsSavingAssignees(true);

      dispatch(
        updateAssigneesTaskService(
          selectedAssignees,
          task.project,
          task._id,
          token
        )
      );

      setAssignees(allTaskAssignee)

      setIsAssignMode(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingAssignees(false);
    }
  };

  const cancelAssigneeEdit = () => {
    setSelectedAssignees([]);
    setIsAssignMode(false);
  };

  const handleDeleteTask = () => {
    alert("Dummy delete: task removed");
    onClose();
  };

  // ================= UI =================
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative z-10 h-[100dvh] w-full md:h-[90vh] md:max-w-6xl bg-white rounded-none md:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* ================= LEFT ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* HEADER */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {task.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Task ID: {task._id}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditingDesc(true)}
                className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100 flex items-center gap-1"
              >
                <Pencil size={14} /> Edit
              </button>

              <button
                onClick={handleDeleteTask}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100 flex items-center gap-1"
              >
                <Trash2 size={14} /> Delete
              </button>

              <button
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X />
              </button>
            </div>
          </div>

          {/* DESCRIPTION */}
          <section className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              Description
            </h3>

            {!isEditingDesc ? (
              <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
                {description || "No description provided."}
              </p>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border p-3 text-sm focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditingDesc(false)}
                    className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setDescription(task.description || "");
                      setIsEditingDesc(false);
                    }}
                    className="rounded-lg border px-4 py-1.5 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* SUBTASKS */}
          <section className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              Subtasks
            </h3>

            <div className="space-y-2">
              {subtasks.map((sub, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={sub.completed} readOnly />
                    <span
                      className={`text-sm ${
                        sub.completed
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {sub.title}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteSubtask(i)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add a subtask..."
                className="flex-1 rounded-lg border p-2 text-sm"
              />
              <button
                onClick={handleAddSubtask}
                className="rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 flex items-center gap-1"
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </section>

          {/* ATTACHMENTS */}
          <section className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              Attachments
            </h3>

            <div className="space-y-2">
              {attachments.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border p-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <Paperclip size={16} />
                    <span className="truncate">{file.name}</span>
                    <span className="text-xs text-gray-400">{file.size}</span>
                  </div>

                  <a
                    href={file.url}
                    download
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <Download size={14} /> Download
                  </a>
                </div>
              ))}
            </div>

            <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
              <Paperclip size={16} />
              Add attachment
              <input
                type="file"
                className="hidden"
                onChange={handleAttachmentAdd}
              />
            </label>
          </section>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l bg-gray-50 p-4 sm:p-6">
          {/* ASSIGNEES */}
          <section className="mb-6">
            <h4 className="mb-2 text-xs font-semibold uppercase text-gray-500">
              Assignees
            </h4>

            {!isAssignMode ? (
              <div className="flex flex-wrap gap-2">
                {assignees.map((u, i) => (
                  <div
                    key={i}
                    title={u.name}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700"
                  >
                    {u.name[0]}
                  </div>
                ))}

                <button
                  onClick={openAssigneeEditor}
                  className="flex h-8 w-8 items-center justify-center rounded-full border text-gray-500 hover:bg-gray-100"
                  title="Edit assignees"
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <div className="rounded-xl border bg-white shadow-lg">
                {/* HEADER */}
                <div className="flex items-center justify-between border-b px-4 py-2">
                  <span className="text-sm font-semibold">
                    Select assignees
                  </span>
                  <button onClick={cancelAssigneeEdit}>
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
                        {member.user.name[0]}
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
                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-2 border-t px-4 py-3">
                  <button
                    onClick={cancelAssigneeEdit}
                    className="rounded-lg border px-4 py-1.5 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAssignees}
                    disabled={isSavingAssignees}
                    className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {isSavingAssignees ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* ACTIVITY */}
          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase text-gray-500">
              Activity
            </h4>
            <div className="space-y-3 text-sm text-gray-600">
              {(task.activities || ["Task created", "Assignees updated"]).map(
                (a, i) => (
                  <div key={i} className="flex gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>{a}</span>
                  </div>
                )
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
