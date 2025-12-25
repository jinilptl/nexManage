import React from "react";
import KanbanBoard from "../kanban/KanbanBoard";

export default function ProjectContent({
  activeTab,
  tasks,
  setTasks,
  reorderTaskInColumn
}) {

    console.log("reorder task  in content---> ",reorderTaskInColumn);
    
  const handleMoveTask = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      )
    );
  };

  if (activeTab === "board") {
    return (
      <KanbanBoard
        tasks={tasks}
        onTaskClick={(task) => console.log("open task", task)}
        onAddTask={(status) => console.log("add task in", status)}
        onMoveTask={handleMoveTask}
        onReorderTask={reorderTaskInColumn}
      />
    );
  }

  return (
    <div className="text-sm text-gray-500">
      {activeTab} view coming soon…
    </div>
  );
}
