import React, { useState, useMemo, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  MoreHorizontal,
  Calendar, Check
} from "lucide-react";
import TaskPriorityBadge from "../kanban/TaskPriorityBadge";
import TaskDetailModal from "../modals/taskModal/TaskDetailModal";
import { formatDueDate } from "../../utils/formatDueDate";
import {
  setSelectedTask,
  setSelectedTaskId,
} from "../../Redux_Config/Slices/tasksSlice";
import { updateTaskStatusService } from "../../services/taskOperations/taskServices";

export default function ListRow({
  task,
  statusLabel,
  isSelected,
  onToggleSelect,
  index,
  statuses = [],
  onMoveTask,
  projectId,
  token,
}) {
  const [openTaskDetailesModal, setOpenTaskDetailesModal] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef(null);
  const dispatch = useDispatch();

  const formattedDate = useMemo(
    () => formatDueDate(task.dueDate),
    [task.dueDate],
  );
  const isOverdue = task.isOverdue;

  // Debug logs (check console)
  // console.log("ListRow props:", { task, statuses, projectId, token });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRowClick = (e) => {
    // Prevent opening modal if clicking checkbox or action menu or dropdown items
    if (
      e.target.closest("input[type='checkbox']") ||
      e.target.closest(".actions-container") || // Use a common class for the whole actions area
      e.target.closest("button")
    ) {
      return;
    }
    setOpenTaskDetailesModal(true);
    dispatch(setSelectedTaskId(task._id));
    dispatch(setSelectedTask(task));
  };


  const handleStatusChange = async (newStatusId) => {
    setShowActions(false); // Close immediately

    // 1. Optimistic Update or Immediate Callback
    if (onMoveTask) {
      onMoveTask(task._id, newStatusId);
    }

    // 2. Dispatch Action if needed (though onMoveTask usually handles dispatch too)
    // If onMoveTask is just for local state/UI, ensure API call happens.
    // In ProjectContent.jsx, onMoveTask is handleMoveTask which might only update local state?
    // Let's check ProjectContent.jsx handleMoveTask implementation.
    // Wait, handleMoveTask in ProjectContent is:
    /*
      const handleMoveTask = (taskId, newStatus) => {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, status: newStatus } : t
          )
        );
      };
    */
    // It ONLY updates local state. API call must be here or separate.
    // In KanbanBoard, dispatch(updateTaskStatusService...) is called.
    // So we MUST dispatch here too.

    if (projectId && token) {
      try {
        await dispatch(updateTaskStatusService(projectId, task._id, newStatusId, token));
      } catch (error) {
        console.error("Failed to update status from list view", error);
        // Revert local state if needed? For now, assume success or error toast handles it.
      }
    }
  };


  return (
    <>
      <div
        onClick={handleRowClick}
        className={`group grid grid-cols-12 gap-4 px-6 py-3 items-center border-b border-gray-100
    transition-all cursor-pointer hover:bg-blue-50/40 relative
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
          <span className="px-2.5 py-0.5 rounded-full text-xs bg-gray-200 truncate">
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
        <div
          className="col-span-1 hidden sm:flex justify-center relative actions-container"
          ref={actionsRef}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-400 hover:text-blue-600"
          >
            <MoreHorizontal size={18} />
          </button>

          {/* Dropdown Menu */}
          {showActions && (
            <div
              className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden text-left"
              onClick={(e) => e.stopPropagation()} // Prevent row click when clicking inside dropdown
            >
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100">
                Change Status
              </div>
              <div className="py-1 max-h-48 overflow-y-auto">
                {statuses.length > 0 ? (
                  statuses.map((status) => (
                    <button
                      key={status._id}
                      onClick={() => handleStatusChange(status._id)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-between group/item transition-colors"
                    >
                      <span>{status.label}</span>
                      {task.status === status._id && <Check size={14} className="text-blue-600" />}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-400 italic">No statuses available</div>
                )}

              </div>
            </div>
          )}
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
