import React from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./kanbanConfig";
import KanbanTaskCard from "./KanbanTaskCard";
import { Plus, MoreHorizontal } from "lucide-react";

export default function KanbanColumn({
  column,
  tasks,
  onMoveTask,
  onAddTask,
  onTaskClick,
  moveTask,
}) {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item) => {
      if (item.columnId !== column.id) {
        onMoveTask(item.id, column.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
   <div
  ref={drop}
  className={`
    min-w-[300px] max-w-[300px]   /* ✅ FIXED WIDTH (MOST IMPORTANT) */
    shrink-0                     /* ✅ DO NOT SHRINK IN FLEX */
    rounded-2xl p-4 transition
    ${
      isOver
        ? "bg-blue-50 border-2 border-dashed border-blue-400"
        : "bg-gray-50"
    }
  `}
>
  {/* Header */}
  <div className="flex justify-between items-center mb-4 sticky top-0 bg-inherit z-10">
    <div className="flex gap-2 items-center">
      <span>{column.icon}</span>
      <h3 className="text-sm font-semibold whitespace-nowrap">
        {column.title}
      </h3>
      <span className="text-xs bg-gray-200 px-2 rounded-full">
        {tasks.length}
      </span>
    </div>

    <div className="flex gap-2">
      <Plus
        size={16}
        className="cursor-pointer"
        onClick={() => onAddTask(column.id)}
      />
      <MoreHorizontal size={16} className="cursor-pointer" />
    </div>
  </div>

  {/* Tasks */}
  <div className="min-h-[150px] space-y-3">
    {tasks.map((task, index) => (
      <KanbanTaskCard
        key={task.id}
        task={task}
        index={index}
        columnId={column.id}
        moveTask={moveTask}
        onClick={onTaskClick}
      />
    ))}
  </div>
</div>

  );
}
