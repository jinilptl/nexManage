import asyncHandler from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Task } from "../../models/Task models/task.models.js";
const attachTaskToRequest = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;

  if (!taskId) {
    throw new ApiError(400, "Task id is required");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  req.task = task;
  next();
});

export { attachTaskToRequest };
