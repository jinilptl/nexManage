import React from "react";
import KanbanBoard from "../kanban/KanbanBoard";
import ListView from "../list/ListView";

export default function ProjectContent({
  activeTab,
  tasks,
  setTasks,
  reorderTaskInColumn,
  onModalOpen,
}) {
  const handleMoveTask = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)),
    );
  };

  if (activeTab === "list") {
    return (
      <div className="w-full h-full overflow-hidden p-4">
        <ListView
          tasks={tasks}
          onTaskClick={(task) => console.log("List View Task Click", task)}
          onMoveTask={handleMoveTask}
        />
      </div>
    );
  }

  if (activeTab === "board") {
    return (
      <div className="w-full min-w-0 overflow-x-hidden h-full flex flex-col">
        <KanbanBoard
          tasks={tasks}
          onTaskClick={(task) => console.log("open task", task)}
          onAddTask={(status) => console.log("add task in", status)}
          onMoveTask={handleMoveTask}
          onReorderTask={reorderTaskInColumn}
          onModalOpen={onModalOpen}
        />
      </div>
    );
  }

  return (
    <div className="text-sm text-gray-500">{activeTab} view coming soon…</div>
  );
}
