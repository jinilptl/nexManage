import asyncHandler from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Project } from "../../models/project.models.js";

const isProjectManager = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  const projectId = req.params.projectId || req.project?._id;

  if (!projectId) {
    throw new ApiError(400, "ProjectId not found");
  }

  const project = req.project || (await Project.findById(projectId));

  if (req.user.role === "admin" || req.user.role === "super_admin") {
    req.project = project;
    return next();
  }

  if (!project) {
    throw new ApiError(400, "Project context missing");
  }

  if (
    !project.projectManager ||
    project.projectManager.toString() !== userId.toString()
  ) {
    throw new ApiError(403, "Only project manager can perform this action");
  }
  req.project = project;
  next();
});

export { isProjectManager };
