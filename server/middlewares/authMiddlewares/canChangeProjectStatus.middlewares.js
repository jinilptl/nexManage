import asyncHandler from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Project } from "../../models/project.models.js";

const canChangeProjectStatus = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  const projectId = req.params.projectId || req.params.id;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const isAdmin =
    req.user?.role === "admin" || req.user?.role === "super_admin";
  const isCreator =
    project.createdBy && project.createdBy.toString() === userId.toString();
  const isManager =
    project.projectManager &&
    project.projectManager.toString() === userId.toString();

  if (isAdmin || isCreator || isManager) {
    req.project = project;
    return next();
  }

  throw new ApiError(
    403,
    "Only project creator, project manager, or admin can change project status",
  );
});

export { canChangeProjectStatus };
