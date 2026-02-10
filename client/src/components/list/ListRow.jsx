import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { MoreHorizontal, Calendar } from "lucide-react";
import TaskPriorityBadge from "../kanban/TaskPriorityBadge";
import TaskDetailModal from "../modals/taskModal/TaskDetailModal";
import { formatDueDate } from "../../utils/formatDueDate";
import {
  setSelectedTask,
  setSelectedTaskId,
} from "../../Redux_Config/Slices/tasksSlice";

export default function ListRow({
  task,
  statusLabel,
  isSelected,
  onToggleSelect,
  index,
}) {
  const [openTaskDetailesModal, setOpenTaskDetailesModal] = useState(false);
  const dispatch = useDispatch();

  const formattedDate = useMemo(
    () => formatDueDate(task.dueDate),
    [task.dueDate],
  );
  const isOverdue = task.isOverdue;

  const handleRowClick = (e) => {
    // Prevent opening modal if clicking checkbox or action buttons
    if (
      e.target.closest("input[type='checkbox']") ||
      e.target.closest("button")
    ) {
      return;
    }
    setOpenTaskDetailesModal(true);
    dispatch(setSelectedTaskId(task._id));
    dispatch(setSelectedTask(task));
  };

  return (
    <>
      <div
        onClick={handleRowClick}
        className={`group grid grid-cols-12 gap-4 px-6 py-3 items-center border-b border-gray-100
    transition-all cursor-pointer hover:bg-blue-50/40
    ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
    ${isSelected ? "bg-blue-100/40" : ""}
  `}
      >
        {/* Checkbox */}
        {/* <div className="col-span-1 flex justify-center">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(task._id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-transform transform group-hover:scale-110"
                    />
                </div> */}

        {/* Task Name */}
        <div className="col-span-4 font-medium text-gray-900 truncate">
          {task.title}
        </div>

        {/* Status */}
        <div className="col-span-2 hidden sm:flex">
          <span className="px-2.5 py-0.5 rounded-full text-xs bg-gray-200">
            {statusLabel}
          </span>
        </div>

        {/* Priority */}
        <div className="col-span-2 hidden md:block">
          <TaskPriorityBadge priority={task.priority} />
        </div>

        {/* Assignee */}
        <div className="col-span-2 hidden lg:flex -space-x-2">
          {task.assignees?.length ? (
            task.assignees.map((a, i) => (
              <div
                key={i}
                className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center ring-2 ring-white"
              >
                {a.name?.[0]}
              </div>
            ))
          ) : (
            <span className="text-gray-400 text-xs italic">—</span>
          )}
        </div>

        {/* Due Date */}
        <div className="col-span-1 hidden xl:flex justify-start text-sm">
          <span
            className={isOverdue ? "text-red-600 font-medium" : "text-gray-500"}
          >
            {formattedDate}
          </span>
        </div>

        {/* Actions */}
        <div className="col-span-1 hidden sm:flex justify-center group-hover:opacity-100">
          <button className="p-1.5 hover:bg-gray-100 rounded-md">
            <MoreHorizontal size={18} color="blue" />
          </button>
        </div>
      </div>

      {openTaskDetailesModal && (
        <TaskDetailModal
          task={task}
          onClose={() => setOpenTaskDetailesModal(false)}
        />
      )}
    </>
  );
}
