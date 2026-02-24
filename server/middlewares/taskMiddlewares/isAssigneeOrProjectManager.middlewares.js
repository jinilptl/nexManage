import asyncHandler from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Task as TaskModel } from "../../models/Task models/task.models.js";
import { Project as ProjectModel } from "../../models/project.models.js";

const isAssigneeOrProjectManager = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  const projectId = req.params.projectId || req.project?._id;
  const taskId = req.params.taskId || req.task?._id;

  const task = req.task || (await TaskModel.findById(taskId));
  const project = req.project || (await ProjectModel.findById(projectId));

  if (!task || !project) {
    throw new ApiError(400, "Task or project context missing");
  }

  if (req.user.role === "super_admin" || req.user.role === "admin") {
    return next();
  }

  const isMainManager =
    project.projectManager &&
    project.projectManager.toString() === userId.toString();

  const member = project.projectMembers.find(
    (m) => m.user && m.user.toString() === userId.toString() && m.status === "active"
  );

  const isRoleManager = member?.roleInProject === "project-manager";
  const isObserverRole = member?.roleInProject === "observer";

  const isAssignee = task.assignees.some(
    (id) => id.toString() === userId.toString()
  );

  if (!isMainManager && !isRoleManager && !isAssignee && !isObserverRole) {
    throw new ApiError(
      403,
      "Only task assignee or project manager can perform this action"
    );
  }

  next();
});

export { isAssigneeOrProjectManager };
