import React from "react";
import KanbanBoard from "../kanban/KanbanBoard";

export default function ProjectContent({
  activeTab,
  tasks,
  setTasks,
  reorderTaskInColumn,
  onModalOpen,
}) {

    
    
  const handleMoveTask = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      )
    );
  };

 if (activeTab === "board") {
  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      <div className="overflow-x-auto max-w-full">
        <div className="min-w-0">
          <KanbanBoard
            tasks={tasks}
            onTaskClick={(task) => console.log("open task", task)}
            onAddTask={(status) => console.log("add task in", status)}
            onMoveTask={handleMoveTask}
            onReorderTask={reorderTaskInColumn}
            onModalOpen={onModalOpen}
          />
        </div>
      </div>
    </div>
  );
}


  return (
    <div className="text-sm text-gray-500">
      {activeTab} view coming soon…
    </div>
  );
}
