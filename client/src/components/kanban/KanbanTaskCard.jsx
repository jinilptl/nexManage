import React, { useRef, useMemo } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./kanbanConfig"; // Assuming this is correct
import { Paperclip, MessageSquare, Calendar, GripVertical, Tag } from "lucide-react";

// --- Utility Functions (Place in a separate file in a real app) ---

/**
 * Formats a date string into a readable short format.
 * @param {string} dateString
 * @returns {string}
 */
const formatDueDate = (dateString) => {
  if (!dateString) return 'No Date';
  try {
    // Simple, robust date format (e.g., "Dec 31")
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch (e) {
    return dateString; // Return original if parsing fails
  }
};

// --- Config (Place in a separate file) ---

const priorityConfig = {
  high: { bg: "bg-red-100", border: "border-red-400", dot: "bg-red-600", text: "text-red-800" },
  medium: { bg: "bg-amber-100", border: "border-amber-400", dot: "bg-amber-600", text: "text-amber-800" },
  low: { bg: "bg-emerald-100", border: "border-emerald-400", dot: "bg-emerald-600", text: "text-emerald-800" },
};

// --- Sub-Components for Clarity ---

const TaskPriorityBadge = ({ priority }) => {
  const config = priorityConfig[priority] || priorityConfig.low;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};

const TaskMetaInfo = ({ attachments, comments }) => (
  <div className="flex items-center gap-3">
    {attachments > 0 && (
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Paperclip size={14} className="text-gray-400" />
        <span className="font-medium">{attachments}</span>
      </div>
    )}
    {comments > 0 && (
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <MessageSquare size={14} className="text-gray-400" />
        <span className="font-medium">{comments}</span>
      </div>
    )}
  </div>
);


// --- Main Component ---

export default function KanbanTaskCard({
  task,
  index,
  columnId,
  moveTask,
  onClick,
}) {
  const ref = useRef(null);

  // 1. DND Logic (Kept as is - it's fine)
  /* ---------- DROP (for reorder) ---------- */
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover(item) {
      if (!ref.current || item.columnId !== columnId || item.index === index) return;
      moveTask(columnId, item.index, index);
      item.index = index;
    },
  });

  /* ---------- DRAG ---------- */
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task.id, index, columnId },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));

  // 2. Calculated Values
  const cardConfig = priorityConfig[task.priority] || priorityConfig.low;
  const formattedDate = useMemo(() => formatDueDate(task.dueDate), [task.dueDate]);

  return (
    <div
      ref={ref}
      onClick={() => onClick(task)}
      className={`
        group relative bg-white rounded-xl shadow-md border-t-4 ${cardConfig.border} p-4 mb-3 cursor-pointer 
        transition-all duration-300 transform
        hover:shadow-xl hover:scale-[1.01]
        ${isDragging ? "opacity-30 rotate-1 scale-95" : ""}
      `}
    >
      {/* 1. Drag Handle (More subtle) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab">
        <GripVertical size={18} className="text-gray-400" />
      </div>

      {/* 2. Header: Priority / Tags */}
      <div className="flex items-center justify-between mb-2">
        <TaskPriorityBadge priority={task.priority} />
        {/* Conceptual: Add other tags/status here if needed */}
        {/* Example: task.tag && <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">#{task.tag}</span> */}
      </div>

      {/* 3. Task Title (More prominent) */}
      <h4 className="text-base font-bold text-gray-900 mb-3 leading-snug">
        {task.title}
      </h4>
      
      {/* 4. Description (Conceptual: Add a short snippet if available) */}
      {/* {task.descriptionSnippet && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.descriptionSnippet}</p>
      )} */}

      {/* 5. Meta Info: Attachments / Comments */}
      {(task.attachments > 0 || task.comments > 0) && (
        <TaskMetaInfo attachments={task.attachments} comments={task.comments} />
      )}
      
      {/* Separator */}
      <div className="my-3 border-t border-gray-100"></div>

      {/* 6. Footer: Assignee & Due Date */}
      <div className="flex items-center justify-between">
        {/* Assignee */}
        <div className="flex items-center gap-2">
          <img
            src={task.assignee.avatar}
            alt={task.assignee.name || "Assignee"}
            className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
          <span className="text-xs font-medium text-gray-700 truncate max-w-[80px]">
            {task.assignee.name}
          </span>
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
          <Calendar size={14} className="text-gray-400" />
          <span className={task.isOverdue ? "text-red-500" : ""}>
            {formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
}