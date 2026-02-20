import React from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./kanbanConfig";
import KanbanTaskCard from "./KanbanTaskCard";
import { Plus } from "lucide-react";

export default function KanbanColumn({
  column,
  tasks,
  onMoveTaskToColumn,
  onReorderTask,
  onAddTask,
  onTaskClick,
  onModalOpen,
  userRole,
}) {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item) => {
      if (item.columnId !== column._id) {
        onMoveTaskToColumn(item.id, column._id);
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
        min-w-[300px] max-w-[300px]
        shrink-0 rounded-2xl p-4 transition
        ${isOver
          ? "bg-blue-50 border-2 border-dashed border-blue-400"
          : "bg-gray-50"
        }
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-inherit z-10">
        <div className="flex gap-2 items-center">
          <h3 className="text-sm font-semibold">{column.label}</h3>
          <span className="text-xs bg-gray-200 px-2 rounded-full">
            {tasks.length}
          </span>
        </div>

        {column.isDefault && userRole !== "member" && (
          <Plus
            size={16}
            className="cursor-pointer"
            onClick={() => {
              onAddTask(column._id);
              onModalOpen(true);
            }}
          />
        )}
      </div>

      {/* Tasks */}
      <div className="min-h-[150px] space-y-3">
        {tasks.map((task, index) => (
          <KanbanTaskCard
            key={task._id}
            task={task}
            index={index}
            columnId={column._id}
            moveTask={onReorderTask}
            onClick={onTaskClick}
          />
        ))}
      </div>
    </div>
  );
}
