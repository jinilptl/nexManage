import { Plus, Trash2, ListChecks, Check } from "lucide-react";
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

  const completedCount = subtasks.filter((s) => s.completed).length;
  const totalCount = subtasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const addSubtask = () => {
    if (!canManage) return;
    if (!newSubtask.trim()) return;

    dispatch(createSubTaskService(newSubtask, task.project, task._id, token));
    setNewSubtask("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubtask();
    }
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
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2.5">
          <div className="p-1.5 bg-violet-50 text-violet-500 rounded-lg">
            <ListChecks size={14} />
          </div>
          Subtasks
          {totalCount > 0 && (
            <span className="text-[10px] font-semibold text-gray-400 normal-case tracking-normal ml-0.5">
              {completedCount}/{totalCount}
            </span>
          )}
        </h3>
      </div>

      {totalCount > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-gray-400">Progress</span>
            <span className={`text-[10px] font-bold ${progress === 100 ? "text-emerald-600" : "text-gray-500"}`}>
              {progress}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${progress === 100
                  ? "bg-emerald-500"
                  : progress > 50
                    ? "bg-blue-500"
                    : "bg-violet-500"
                }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        {subtasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <ListChecks size={20} className="text-gray-300 mb-1.5" />
            <p className="text-xs text-gray-400 font-medium">No subtasks yet</p>
          </div>
        )}

        {subtasks.map((sub) => (
          <div
            key={sub._id}
            className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 border transition-all duration-200 ${sub.completed
                ? "bg-emerald-50/30 border-emerald-100"
                : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
              }`}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <label className="relative flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  onChange={(e) => handleCheckBox(e, sub)}
                  checked={sub.completed}
                  className="sr-only peer"
                  disabled={!canManage}
                />
                <div className={`w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-all duration-200 ${sub.completed
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-gray-300 hover:border-gray-400 bg-white"
                  } ${canManage ? "cursor-pointer" : "opacity-60 cursor-default"}`}>
                  {sub.completed && <Check size={12} className="text-white" strokeWidth={3} />}
                </div>
              </label>

              <span className={`text-sm transition-all duration-200 truncate ${sub.completed
                  ? "line-through text-gray-400"
                  : "text-gray-700 font-medium"
                }`}>
                {sub.title}
              </span>
            </div>

            {canManage && (
              <button
                onClick={() => handleDeleteSubTask(sub)}
                className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-all duration-200 opacity-0 group-hover:opacity-100"
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
            onKeyDown={handleKeyDown}
            placeholder="Add a subtask..."
            className="flex-1 rounded-xl bg-gray-50 hover:bg-gray-100 focus:bg-white px-4 py-2.5 text-sm outline-none border border-gray-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 transition-all duration-200 placeholder-gray-400"
          />
          <button
            onClick={addSubtask}
            disabled={!newSubtask.trim()}
            className="rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-gray-200 disabled:text-gray-400 px-4 text-white text-sm font-semibold flex items-center cursor-pointer gap-1.5 transition-all duration-200 disabled:cursor-not-allowed shadow-sm shadow-violet-200 disabled:shadow-none"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      )}
    </section>
  );
}
