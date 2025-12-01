import { Project as ProjectModel } from "../../models/project.models.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import {Team as TeamModel} from "../../models/team.models.js"




 const addProjectMember = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { userId, roleInProject, addedFromTeam } = req.body;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  // Allowed roles (based on your schema)
  const validRoles = [
    "project-manager",
    "developer",
    "tester",
    "designer",
    "qa",
    "reviewer",
    "contributor",
  ];

  if (roleInProject && !validRoles.includes(roleInProject)) {
    throw new ApiError(400, "Invalid project role");
  }

  // Find project
  const project = await ProjectModel.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Check user already in projectMembers
  const existingMember = project.projectMembers.find(
    (member) => member.user.toString() === userId.toString()
  );

  if (existingMember) {
    throw new ApiError(409, "This user is already a member of the project");
  }

  // Add new member
  const newMember = {
    user: userId,
    roleInProject: roleInProject || "contributor",
    addedFromTeam: addedFromTeam || null,
    status: "active",
    addedAt: Date.now(),
  };

  project.projectMembers.push(newMember);
  await project.save();

  return res.status(201).json(
    new ApiResponse(
      201,
      "Member added to project successfully",
      newMember
    )
  );
});


export {addProjectMember}