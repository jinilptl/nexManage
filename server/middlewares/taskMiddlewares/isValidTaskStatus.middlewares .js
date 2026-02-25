import asyncHandler from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Task as TaskModel } from "../../models/Task models/task.models.js";
import { Project as ProjectModel } from "../../models/project.models.js";

const isValidTaskStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const projectId = req.params.projectId || req.project?._id;

  if (!projectId) {
    throw new ApiError(400, "ProjectId not found");
  }

  const project = req.project || (await ProjectModel.findById(projectId));

  if (!status) {
    throw new ApiError(400, "Task status is required");
  }

  const validStatus = project?.taskStatuses?.some(
    (s) => s._id.toString() === status || s.key === status
  );
  if (!validStatus) {
    throw new ApiError(400, "Invalid task status for this project");
  }

  next();
});

export { isValidTaskStatus };
