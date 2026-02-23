import React, { useState, useMemo, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { MoreHorizontal, Calendar, Check, Eye } from "lucide-react";
import TaskPriorityBadge from "../kanban/TaskPriorityBadge";
import TaskDetailModal from "../modals/taskModal/TaskDetailModal";
import Avatar from "../common/Avatar";
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleViewTask = () => {
    setShowActions(false);
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

    if (projectId && token) {
      try {
        await dispatch(
          updateTaskStatusService(projectId, task._id, newStatusId, token),
        );
      } catch (error) {
        console.error("Failed to update status from list view", error);
      }
    }
  };

  return (
    <>
      <div
        className={`group grid grid-cols-12 gap-4 px-6 py-3 items-center border-b border-gray-100
    transition-all hover:bg-blue-50/40 relative
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
        <div className="col-span-2 sm:flex">
          <span className="px-2.5 py-0.5 rounded-full text-xs bg-gray-200 truncate">
            {statusLabel}
          </span>
        </div>

        {/* Priority */}
        <div className="col-span-2 md:block">
          <TaskPriorityBadge priority={task.priority} />
        </div>

        {/* Assignee */}
        <div className="col-span-2 lg:flex -space-x-2">
          {task.assignees?.length ? (
            task.assignees.map((a, i) => (
              <Avatar
                key={i}
                user={a}
                className="w-8 h-8 text-xs ring-2 ring-white"
              />
            ))
          ) : (
            <span className="text-gray-400 text-xs italic">—</span>
          )}
        </div>

        {/* Due Date */}
        <div className="col-span-1 xl:flex justify-start text-sm">
          <span
            className={isOverdue ? "text-red-600 font-medium" : "text-gray-500"}
          >
            {formattedDate}
          </span>
        </div>

        {/* Actions */}
        <div
          className="col-span-1 sm:flex justify-center relative actions-container"
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
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-3 py-2 text-2xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100">
                Actions
              </div>

              {/* View Option */}
              <button
                onClick={handleViewTask}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 transition-colors border-b border-gray-50"
              >
                <Eye size={16} />
                <span>View Task</span>
              </button>

              {/* Status Header */}
              <div className="px-3 py-2 text-2xs font-semibold text-gray-500 bg-gray-50 border-t border-b border-gray-100">
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
                      {task.status === status._id && (
                        <Check size={14} className="text-blue-600" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-400 italic">
                    No statuses available
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {
        openTaskDetailesModal && (
          <TaskDetailModal
            task={task}
            onClose={() => setOpenTaskDetailesModal(false)}
          />
        )
      }
    </>
  );
}
