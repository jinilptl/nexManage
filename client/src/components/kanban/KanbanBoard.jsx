import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { COLUMNS } from "./kanbanConfig";
import KanbanColumn from "./KanbanColumn";

export default function KanbanBoard({
  tasks,
  onTaskClick,
  onAddTask,
  onMoveTask,
  onReorderTask
}) {

  console.log("reorder tasak--> ",onReorderTask);
  
  /* -------- SAME COLUMN REORDER LOGIC -------- */
  const moveTask = (columnId, fromIndex, toIndex) => {
     onReorderTask(columnId, fromIndex, toIndex);
    onMoveTask((prev) => {
      const columnTasks = prev.filter((t) => t.status === columnId);
      const otherTasks = prev.filter((t) => t.status !== columnId);

      const [moved] = columnTasks.splice(fromIndex, 1);
      columnTasks.splice(toIndex, 0, moved);
     

      return [...otherTasks, ...columnTasks];
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="overflow-x-auto">
        <div className="flex gap-6 min-w-max">
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasks.filter((t) => t.status === column.id)}
              onMoveTask={onMoveTask}
              onAddTask={onAddTask}
              onTaskClick={onTaskClick}
              moveTask={moveTask}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
