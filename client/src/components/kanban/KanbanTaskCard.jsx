import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./kanbanConfig";
import { Paperclip, MessageSquare } from "lucide-react";

export default function KanbanTaskCard({
  task,
  index,
  columnId,
  moveTask,
  onClick,
}) {
  const ref = useRef(null);

  /* ---------- DROP (for reorder) ---------- */
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover(item) {
      if (!ref.current) return;

      // ❗ same column only
      if (item.columnId !== columnId) return;

      if (item.index === index) return;

      moveTask(columnId, item.index, index);
      item.index = index; // update dragged index
    },
  });

  /* ---------- DRAG ---------- */
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task.id, index, columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const priorityColor =
    task.priority === "high"
      ? "bg-red-500"
      : task.priority === "medium"
      ? "bg-orange-400"
      : "bg-green-500";

  return (
    <div
      ref={ref}
      onClick={() => onClick(task)}
      className={`relative bg-white rounded-xl border p-4 mb-4 cursor-pointer transition
        ${isDragging ? "opacity-50" : "hover:shadow-md"}
      `}
    >
      {/* Priority strip */}
      <span
        className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${priorityColor}`}
      />

      <h4 className="text-sm font-medium mb-2">{task.title}</h4>

      <div className="flex gap-4 text-xs text-gray-500 mb-2">
        {task.attachments > 0 && (
          <span className="flex gap-1 items-center">
            <Paperclip size={14} /> {task.attachments}
          </span>
        )}
        {task.comments > 0 && (
          <span className="flex gap-1 items-center">
            <MessageSquare size={14} /> {task.comments}
          </span>
        )}
      </div>

      <div className="flex justify-between items-center">
        <img
          src={task.assignee.avatar}
          alt=""
          className="w-7 h-7 rounded-full"
        />
        <span className="text-xs text-gray-500">{task.dueDate}</span>
      </div>
    </div>
  );
}
