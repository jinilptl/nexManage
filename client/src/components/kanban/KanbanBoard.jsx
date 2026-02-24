import React, { useMemo, useState, useEffect, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import KanbanColumn from "./KanbanColumn";
import { useDispatch, useSelector } from "react-redux";
import {
  updateTaskOrderService,
  updateTaskStatusService,
} from "../../services/taskOperations/taskServices";
import { deleteTaskStatusFromProjectService } from "../../services/projectsOperations/projectsServices";
import { Plus } from "lucide-react";
import AddColumnModal from "../modals/taskModal/AddColumnModal";

export default function KanbanBoard({
  tasks: initialTasks,
  onTaskClick,
  onAddTask,
  onModalOpen,
  onMoveTask,
  isObserver = false,
}) {
  const project = useSelector((state) => state.projects.selectedProject);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const [tasks, setTasks] = useState([]);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);

  const dispatch = useDispatch();

  const scrollContainerRef = useRef(null);
  const scrollSpeedRef = useRef(0);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const startScrolling = () => {
      if (!animationFrameRef.current) {
        const scroll = () => {
          if (scrollContainerRef.current && scrollSpeedRef.current !== 0) {
            scrollContainerRef.current.scrollLeft += scrollSpeedRef.current;
            animationFrameRef.current = requestAnimationFrame(scroll);
          } else {
            animationFrameRef.current = null;
          }
        };
        animationFrameRef.current = requestAnimationFrame(scroll);
      }
    };

    const stopScrolling = () => {
      scrollSpeedRef.current = 0;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };

    const handleDragOver = (e) => {
      if (!scrollContainerRef.current) return;

      const { left, right } = scrollContainerRef.current.getBoundingClientRect();
      const edgeThreshold = 100;
      const clientX = e.clientX;

      if (clientX < left + edgeThreshold) {
        const intensity = Math.max(0, left + edgeThreshold - clientX) / edgeThreshold;
        scrollSpeedRef.current = -(10 + intensity * 15);
        startScrolling();
      } else if (clientX > right - edgeThreshold) {
        const intensity = Math.max(0, clientX - (right - edgeThreshold)) / edgeThreshold;
        scrollSpeedRef.current = 10 + intensity * 15;
        startScrolling();
      } else {
        stopScrolling();
      }
    };

    const handleDragEnd = () => {
      stopScrolling();
    };

    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("dragend", handleDragEnd);
    document.addEventListener("drop", handleDragEnd);

    return () => {
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("dragend", handleDragEnd);
      document.removeEventListener("drop", handleDragEnd);
      stopScrolling();
    };
  }, []);

  useEffect(() => {
    setTasks(initialTasks || []);
  }, [project?.id, initialTasks]);

  const columns = useMemo(() => {
    return (
      project?.data?.taskStatuses?.slice().sort((a, b) => a.order - b.order) ||
      []
    );
  }, [project]);

  const canViewAllTasks = useMemo(() => {
    if (!user) return false;
    if (user.role === "super_admin" || user.role === "admin") return true;

    const projectMembers = project?.data?.projectMembers || [];
    const currentMember = projectMembers.find(
      (m) => (m.user?._id || m.user) === user?._id,
    );

    if (currentMember?.roleInProject === "project-manager") return true;
    if (currentMember?.roleInProject === "observer") return true;

    return false;
  }, [user, project]);

  const reorderTask = (columnId, taskId, fromIndex, toIndex) => {
    if (isObserver) return;

    let realToIndex = toIndex;

    if (!canViewAllTasks) {
      const columnTasks = tasks.filter((t) => t.status === columnId);
      const isVisible = (t) =>
        t.assignees?.some((a) => (a._id || a) === user?._id);

      const movedTaskIndex = columnTasks.findIndex((t) => t._id === taskId);
      if (movedTaskIndex !== -1) {
        const tempColumnTasks = [...columnTasks];
        tempColumnTasks.splice(movedTaskIndex, 1);
        const currentVisibleTasks = tempColumnTasks.filter(isVisible);

        if (toIndex >= currentVisibleTasks.length) {
          if (currentVisibleTasks.length === 0) {
            realToIndex = tempColumnTasks.length;
          } else {
            const lastVisibleTask =
              currentVisibleTasks[currentVisibleTasks.length - 1];
            const lastVisibleIndex = tempColumnTasks.findIndex(
              (t) => t._id === lastVisibleTask._id,
            );
            realToIndex = lastVisibleIndex + 1;
          }
        } else {
          const targetVisibleTask = currentVisibleTasks[toIndex];
          realToIndex = tempColumnTasks.findIndex(
            (t) => t._id === targetVisibleTask._id,
          );
        }
      }
    }

    setTasks((prev) => {
      const columnTasks = prev.filter((t) => t.status === columnId);
      const otherTasks = prev.filter((t) => t.status !== columnId);

      const movedTaskIndex = columnTasks.findIndex((t) => t._id === taskId);
      if (movedTaskIndex === -1) return prev;

      const updated = [...columnTasks];
      const [moved] = updated.splice(movedTaskIndex, 1);
      updated.splice(realToIndex, 0, moved);

      return [...otherTasks, ...updated];
    });

    dispatch(
      updateTaskOrderService(project.data._id, taskId, realToIndex, token),
    );
  };

  const moveTaskToColumn = (taskId, targetColumnId) => {
    if (isObserver) return;

    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId ? { ...task, status: targetColumnId } : task,
      ),
    );

    dispatch(
      updateTaskStatusService(project.data._id, taskId, targetColumnId, token),
    );

    if (onMoveTask) {
      onMoveTask(taskId, targetColumnId);
    }
  };

  const handleDeleteColumn = (statusId) => {
    if (isObserver) return;
    dispatch(deleteTaskStatusFromProjectService(project.data._id, statusId, token));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full min-w-0 overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-hidden max-w-full kanban-scrollbar"
        >
          <div className="flex gap-2 min-w-max px-2 pb-4 items-start">
            {columns.map((column) => (
              <KanbanColumn
                key={column._id}
                column={column}
                tasks={tasks.filter((t) => {
                  const isStatus = t.status === column._id;
                  if (!isStatus) return false;
                  if (canViewAllTasks) return true;
                  return t.assignees?.some(
                    (a) => (a._id || a) === user?._id,
                  );
                })}
                onMoveTaskToColumn={moveTaskToColumn}
                onReorderTask={reorderTask}
                onAddTask={onAddTask}
                onTaskClick={onTaskClick}
                onModalOpen={onModalOpen}
                userRole={user?.role}
                onDeleteColumn={() => handleDeleteColumn(column._id)}
                isObserver={isObserver}
              />
            ))}

            {user?.role !== "member" && !isObserver && (
              <button
                onClick={() => setIsAddColumnOpen(true)}
                className="h-12 w-12 cursor-pointer flex items-center justify-center rounded-lg border border-dashed border-gray-300 hover:bg-gray-100 text-gray-500"
              >
                <Plus size={30} />
              </button>
            )}
          </div>
        </div>
      </div>

      {isAddColumnOpen && (
        <AddColumnModal
          onClose={() => setIsAddColumnOpen(false)}
          projectId={project.data._id}
          token={token}
        />
      )}
    </DndProvider>
  );
}
