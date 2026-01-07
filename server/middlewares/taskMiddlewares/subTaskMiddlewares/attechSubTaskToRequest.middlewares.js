import asyncHandler from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Task } from "../../models/Task models/task.models.js"
const  attachSubTaskToRequest = asyncHandler(async (req, res, next) => {
  const { subTaskId } = req.params;

  if (!subTaskId) {
    throw new ApiError(400, "Task id is required");
  }

  const subTask = await Task.findById(subTaskId);

  if (!subTask) {
    throw new ApiError(404, "Task not found");
  }

  req.subTask = subTask;
  next();
});

export {  attachSubTaskToRequest };
