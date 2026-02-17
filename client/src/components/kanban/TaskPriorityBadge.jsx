import React from "react";
import { priorityConfig } from "../../config/priorityConfig";

const TaskPriorityBadge = ({ priority }) => {
  const config = priorityConfig[priority] || priorityConfig.low;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold ${config.bg} ${config.text}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : "Low"}
    </span>
  );
};

export default TaskPriorityBadge;
