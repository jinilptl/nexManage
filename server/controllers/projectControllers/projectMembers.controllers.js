import { Project as ProjectModel } from "../../models/project.models.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import {Team as TeamModel} from "../../models/team.models.js"

const addProjectMember = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { userId, roleInProject, addedFromTeam } = req.body;

  if (!projectId) throw new ApiError(400, "Project ID is required");
  if (!userId) throw new ApiError(400, "User ID is required");

  const validRoles = [
    "project-manager",
    "developer",
    "tester",
    "designer",
    "qa",
    "reviewer",
    "contributor"
  ];

  if (roleInProject && !validRoles.includes(roleInProject)) {
    throw new ApiError(400, "Invalid roleInProject value");
  }

  const project = await ProjectModel.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  // Duplicate check
  const exists = project.projectMembers.find(
    m => m.user.toString() === userId.toString()
  );
  if (exists) {
    throw new ApiError(409, "This user is already a member of this project");
  }

  // Add new member
  const newMember = {
    user: userId,
    roleInProject: roleInProject || "contributor",
    status: "active",
    addedFromTeam: addedFromTeam || null,
    addedAt: Date.now()
  };

  project.projectMembers.push(newMember);
  await project.save();

  return res.status(201).json(
    new ApiResponse(201, "Member added to project successfully", newMember)
  );
});


const getAllProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) throw new ApiError(400, "Project ID is required");

  const project = await ProjectModel.findById(projectId)
    .populate("projectMembers.user", "name email")
    .populate("projectMembers.addedFromTeam", "teamName");

  if (!project) throw new ApiError(404, "Project not found");

  return res.status(200).json(
    new ApiResponse(
      200,
      "Project members fetched successfully",
      project.projectMembers
    )
  );
});


const updateProjectMember = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;
  const { roleInProject, status } = req.body;

  if (!projectId || !memberId)
    throw new ApiError(400, "Project ID and member ID are required");

  const project = await ProjectModel.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  const member = project.projectMembers.find(
    m => m.user.toString() === memberId.toString()
  );

  if (!member) throw new ApiError(404, "Member not found in this project");

  // Prevent editing project manager here
  if (member.user.toString() === project.projectManager?.toString()) {
    throw new ApiError(
      400,
      "Project manager role cannot be updated using this endpoint"
    );
  }

  const validRoles = [
    "developer",
    "tester",
    "designer",
    "qa",
    "reviewer",
    "contributor"
  ];

  if (roleInProject) {
    if (!validRoles.includes(roleInProject)) {
      throw new ApiError(400, "Invalid roleInProject");
    }
    member.roleInProject = roleInProject;
  }

  if (status) {
    if (!["active", "removed"].includes(status)) {
      throw new ApiError(400, "Invalid status value");
    }
    member.status = status;
  }

  await project.save();

  return res.status(200).json(
    new ApiResponse(200, "Project member updated successfully", member)
  );
});



 const removeProjectMember = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;

  if (!projectId || !memberId)
    throw new ApiError(400, "Project ID and member ID are required");

  const project = await ProjectModel.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  const member = project.projectMembers.find(
    m => m.user.toString() === memberId.toString()
  );

  if (!member) {
    throw new ApiError(404, "Member not found");
  }

  // Prevent removing project manager
  if (member.user.toString() === project.projectManager?.toString()) {
    throw new ApiError(
      400,
      "Cannot remove project manager. Assign a new manager first."
    );
  }

  member.status = "removed";

  await project.save();

  return res.status(200).json(
    new ApiResponse(200, "Member removed successfully", member)
  );
});


const syncProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) throw new ApiError(400, "Project ID is required");

  const project = await ProjectModel.findById(projectId).populate("teams");
  if (!project) throw new ApiError(404, "Project not found");

  if (project.projectType === "personal") {
    throw new ApiError(400, "Personal projects do not support team syncing");
  }

  let autoMembers = [];

  for (const team of project.teams) {
    for (const tMember of team.members) {
      autoMembers.push({
        user: tMember.user.toString(),
        addedFromTeam: team._id.toString(),
        roleInProject: "contributor",
        status: "active"
      });
    }
  }

  // Remove duplicates
  const map = new Map();
  autoMembers.forEach(m => map.set(m.user, m));
  autoMembers = Array.from(map.values());

  // Merge into projectMembers
  autoMembers.forEach(auto => {
    const exists = project.projectMembers.find(
      m => m.user.toString() === auto.user.toString()
    );

    if (!exists) {
      project.projectMembers.push(auto);
    }
  });

  await project.save();

  return res.status(200).json(
    new ApiResponse(200, "Project members synced with teams", project)
  );
});


export {addProjectMember,updateProjectMember,removeProjectMember,syncProjectMembers,getAllProjectMembers}