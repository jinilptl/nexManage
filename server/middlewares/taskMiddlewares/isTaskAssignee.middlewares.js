import asyncHandler from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Task as TaskModel } from "../../models/task.models.js";
import { Project as ProjectModel } from "../../models/project.models.js";

const isTaskAssignee = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;

  const taskId = req.params.taskId || req.task?._id;

  if (!taskId) {
    throw new ApiError(400, "TaskId not found");
  }
  const task = req.task || (await TaskModel.findById(taskId));

  if (!task) {
    throw new ApiError(400, "Task context missing");
  }

  const isAssignee = task.assignees.some(
    (id) => id.toString() === userId.toString()
  );

  if (!isAssignee) {
    throw new ApiError(403, "You are not assigned to this task");
  }

  next();
});

export { isTaskAssignee };
