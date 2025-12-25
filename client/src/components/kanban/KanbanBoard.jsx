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
  {/* OUTER WRAPPER (NO SCROLL HERE) */}
  <div className="w-full min-w-0 overflow-hidden">

    {/* SCROLL CONTAINER */}
    <div className="overflow-x-auto overflow-y-hidden max-w-full">
      
      {/* ACTUAL BOARD */}
      <div className="flex gap-6 min-w-max px-2 pb-4">
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
  </div>
</DndProvider>

  );
}
