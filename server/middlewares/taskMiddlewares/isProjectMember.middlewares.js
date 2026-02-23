import asyncHandler from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Project as ProjectModel } from "../../models/project.models.js";

const isProjectMember = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;


  const projectId =
    req.params.projectId

  if (!userId) {
    throw new ApiError(401, "Unauthorized user");
  }

  if (!projectId) {
    throw new ApiError(400, "Project id is required");
  }

  const project = await ProjectModel.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");


  }


  if (req.user.role === 'admin' || req.user.role === 'super_admin') {
    req.project = project;
    req.roleInProject = "admin";
    return next();
  }

  // Check if user is project manager
  if (
    project.projectManager &&
    project.projectManager.toString() === userId.toString()
  ) {
    req.project = project;
    req.roleInProject = "project-manager";
    return next();
  }

  // Check active project member
  const projectMember = project.projectMembers.find(
    (member) => member.user && member.user.toString() === userId.toString() && member.status === "active"
  );

  if (!projectMember) {
    throw new ApiError(
      403,
      "You are not an active member of this project"
    );
  }


  req.project = project;
  req.roleInProject = projectMember.roleInProject;
  next();
});

export { isProjectMember };
