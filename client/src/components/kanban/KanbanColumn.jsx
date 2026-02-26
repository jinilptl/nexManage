import React from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./kanbanConfig";
import KanbanTaskCard from "./KanbanTaskCard";
import { Plus, Trash2 } from "lucide-react";

export default function KanbanColumn({
  column,
  tasks,
  onMoveTaskToColumn,
  onReorderTask,
  onAddTask,
  onTaskClick,
  onModalOpen,
  userRole,
  onDeleteColumn,
  isObserver = false,
}) {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.TASK,
    canDrop: () => !isObserver,
    drop: (item) => {
      if (isObserver) return;
      if (item.columnId !== column._id) {
        onMoveTaskToColumn(item.id, column._id);
      }
    },
    collect: (monitor) => ({
      isOver: !isObserver && monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`
        min-w-[300px] max-w-[300px]
        shrink-0 rounded-2xl p-4 transition
        ${
          isOver
            ? "bg-blue-50 border-2 border-dashed border-blue-400"
            : "bg-gray-50"
        }
      `}
    >
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-inherit z-10">
        <div className="flex gap-2 items-center">
          <h3 className="text-sm font-semibold">{column.label}</h3>
          <span className="text-xs bg-gray-200 px-2 rounded-full">
            {tasks.length}
          </span>
        </div>

        {!isObserver && column.isDefault && userRole !== "member" && (
          <Plus
            size={16}
            className="cursor-pointer text-gray-600 hover:text-blue-600"
            onClick={() => {
              onAddTask(column._id);
              onModalOpen(true);
            }}
          />
        )}

        {!isObserver &&
          !["todo", "in_progress", "review", "done"].includes(column.key) &&
          userRole !== "member" && (
            <Trash2
              size={16}
              className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors"
              onClick={onDeleteColumn}
            />
          )}
      </div>

      <div className="min-h-[150px] space-y-3">
        {tasks.map((task, index) => (
          <KanbanTaskCard
            key={task._id}
            task={task}
            index={index}
            columnId={column._id}
            moveTask={onReorderTask}
            onClick={onTaskClick}
            isObserver={isObserver}
          />
        ))}
      </div>
    </div>
  );
}
