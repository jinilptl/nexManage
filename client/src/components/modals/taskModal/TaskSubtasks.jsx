import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSubTaskService,
  deleteSubtaskService,
  toggleSubtaskCompleteService,
} from "../../../services/taskOperations/taskServices";

export default function TaskSubtasks({ subtasks, task, canManage = false }) {
  const [newSubtask, setNewSubtask] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const addSubtask = () => {
    if (!canManage) return;
    if (!newSubtask.trim()) return;

    dispatch(createSubTaskService(newSubtask, task.project, task._id, token));

    setNewSubtask("");
  };

  const handleCheckBox = (e, subtask) => {
    if (!canManage) return;
    const isCompleted = e.target.checked;

    dispatch(
      toggleSubtaskCompleteService(
        isCompleted,
        subtask._id,
        task._id,
        task.project,
        token,
      ),
    );
  };

  const handleDeleteSubTask = (subtask) => {
    if (!canManage) return;
    dispatch(deleteSubtaskService(subtask._id, task._id, task.project, token));
  };

  return (
    <section className="mb-6">
      <h3 className="mb-2 text-sm font-semibold text-gray-700">Subtasks</h3>

      <div className="space-y-2">
        {subtasks.length === 0 && (
          <p className="text-sm text-gray-400">No subtasks yet</p>
        )}

        {subtasks.map((sub) => (
          <div
            key={sub._id}
            className="flex items-center justify-between rounded-lg bg-gray-100 p-3"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                onChange={(e) => {
                  handleCheckBox(e, sub);
                }}
                checked={sub.completed}
                className={
                  canManage
                    ? "cursor-pointer"
                    : "pointer-events-none opacity-60"
                }
                disabled={!canManage}
              />
              <span
                className={sub.completed ? "line-through text-gray-400" : ""}
              >
                {sub.title}
              </span>
            </div>

            {canManage && (
              <button
                onClick={() => {
                  handleDeleteSubTask(sub);
                }}
                className="text-gray-400 hover:text-red-500 cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {canManage && (
        <div className="mt-3 flex gap-2">
          <input
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            placeholder=" Add a subtask..."
            className="flex-1 rounded-lg bg-gray-100 p-2 text-sm outline-none"
          />
          <button
            onClick={addSubtask}
            className="rounded-lg bg-blue-600 px-4 text-white flex items-center cursor-pointer gap-1"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      )}
    </section>
  );
}
