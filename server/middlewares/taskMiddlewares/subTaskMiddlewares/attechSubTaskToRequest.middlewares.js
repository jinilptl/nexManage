import asyncHandler from "../../../utils/asyncHandler.js";
import { ApiError } from "../../../utils/ApiError.js";
import { SubTask } from "../../../models/Task models/subTask.models.js"
const  attachSubTaskToRequest = asyncHandler(async (req, res, next) => {
  const { subTaskId } = req.params;

  if (!subTaskId) {
    throw new ApiError(400, "subTask id is required");
  }

  const subTask = await SubTask.findById(subTaskId);

  if (!subTask) {
    throw new ApiError(404, "subTask not found");
  }

  req.subTask = subTask;
  next();
});

export {  attachSubTaskToRequest };
