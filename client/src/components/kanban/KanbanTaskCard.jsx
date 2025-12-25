import React, { useRef, useMemo } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./kanbanConfig"; 
import { Paperclip, MessageSquare, Calendar, GripVertical, Tag } from "lucide-react";

// --- Utility Functions ---

const formatDueDate = (dateString) => {
  if (!dateString) return 'No Date';
  try {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch (e) {
    return dateString;
  }
};

// --- Config ---

const priorityConfig = {
  high: { bg: "bg-red-100", border: "border-red-400", dot: "bg-red-600", text: "text-red-800" },
  medium: { bg: "bg-amber-100", border: "border-amber-400", dot: "bg-amber-600", text: "text-amber-800" },
  low: { bg: "bg-emerald-100", border: "border-emerald-400", dot: "bg-emerald-600", text: "text-emerald-800" },
};

// --- Sub-Components ---

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


const TaskTags = ({ tags }) => {
    if (!tags || tags.length === 0) return null;
    return (
        <div className="flex flex-wrap items-center gap-1.5 mt-2 mb-3">
            {tags.slice(0, 3).map((tag, index) => ( 
                <span 
                    key={index} 
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full"
                >
                    <Tag size={10} className="text-blue-500"/>
                    {tag}
                </span>
            ))}
            {tags.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-0.5">
                    +{tags.length - 3} more
                </span>
            )}
        </div>
    );
};


// --- Main Component ---

export default function KanbanTaskCard({
  task,
  index,
  columnId,
  moveTask,
  onClick,
}) {
  const ref = useRef(null);

  // DND Logic (No change)
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover(item) {
      if (!ref.current || item.columnId !== columnId || item.index === index) return;
      moveTask(columnId, item.index, index);
      item.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task.id, index, columnId },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));

  // Calculated Values
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
        {/* Removed conceptual tag example here as it is now in TaskTags component */}
      </div>

      {/* 3. Task Title (Most prominent) */}
      <h4 className="text-base font-bold text-gray-900 mb-2 leading-snug">
        {task.title}
      </h4>
      
      
      {task.description && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-2" title={task.description}>
            {task.description}
        </p>
      )}


      <TaskTags tags={task.tags} /> 

      {/* 6. Meta Info (Attachments/Comments) */}
      {(task.attachments > 0 || task.comments > 0) && (
        <div className="mb-3">
            <TaskMetaInfo attachments={task.attachments} comments={task.comments} />
        </div>
      )}
      
      {/* Separator */}
      <div className="my-2 border-t border-gray-100"></div>

      {/* 7. Footer: Assignee & Due Date */}
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