import React, { useMemo, useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import KanbanColumn from "./KanbanColumn";
import { useDispatch, useSelector } from "react-redux";
import {
  updateTaskOrderService,
  updateTaskStatusService,
} from "../../services/taskOperations/taskServices";

export default function KanbanBoard({
  tasks: initialTasks,
  onTaskClick,
  onAddTask,
  onModalOpen,
}) {
  const project = useSelector((state) => state.projects.selectedProject);
  // console.log("project is -> ",project);
  
  const token = useSelector((state) => state.auth.token);

  const [tasks, setTasks] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    setTasks(initialTasks || []);
  }, [project?.id,initialTasks]);

  const columns = useMemo(() => {
    return (
      project?.data?.taskStatuses?.slice().sort((a, b) => a.order - b.order) ||
      []
    );
  }, [project]);

  
  const reorderTask = (columnId, taskId, fromIndex, toIndex) => {
  setTasks((prev) => {
    const columnTasks = prev.filter((t) => t.status === columnId);
    const otherTasks = prev.filter((t) => t.status !== columnId);

    const updated = [...columnTasks];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);

    return [...otherTasks, ...updated];
  });

  dispatch(
    updateTaskOrderService(project.data._id, taskId, toIndex, token)
  );
};


  const moveTaskToColumn = (taskId, targetColumnId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId ? { ...task, status: targetColumnId } : task
      )
    );

    dispatch(
      updateTaskStatusService(project.data._id, taskId, targetColumnId, token)
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full min-w-0 overflow-hidden">
        <div className="overflow-x-auto overflow-y-hidden max-w-full">
          <div className="flex gap-6 min-w-max px-2 pb-4">
            {columns.map((column) => (
              <KanbanColumn
                key={column._id}
                column={column}
                tasks={tasks.filter((t) => t.status === column._id)}
                onMoveTaskToColumn={moveTaskToColumn}
                onReorderTask={reorderTask}
                onAddTask={onAddTask}
                onTaskClick={onTaskClick}
                onModalOpen={onModalOpen}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
