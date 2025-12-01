import { Project as ProjectModel } from "../../models/project.models.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { Team as TeamModel } from "../../models/team.models.js";

const createProject = asyncHandler(async (req, res) => {
  const { projectName, description, teams } = req.body;


  if (!projectName || !teams || !Array.isArray(teams) || teams.length === 0) {
    throw new ApiError(400, "Project name and at least one team are required");
  }

  const validTeams = await TeamModel.find({ _id: { $in: teams } });

  if (validTeams.length !== teams.length) {
    throw new ApiError(400, "One or more team IDs are invalid");
  }

 
  const createdBy = req.user?._id;
  if (!createdBy) {
    throw new ApiError(401, "Unauthorized: User not found in request");
  }

  
  const newProject = await ProjectModel.create({
    projectName,
    description: description || "",
    createdBy,
    teams,
    projectManager: createdBy, // Default project manager = creator
    projectMembers: [ 
      {
        user: createdBy,
        roleInProject: "project-manager",
        addedFromTeam: null,
        status: "active",
      },
    ],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Project created successfully", newProject));
});

const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await ProjectModel.find()
    .populate("createdBy", "name email")
    .populate("projectManager", "name email")
    .populate("teams", "teamName")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "All projects fetched successfully", projects));
});

const getSingleProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  const project = await ProjectModel.findById(projectId)
    .populate("createdBy", "name email")
    .populate("projectManager", "name email")
    .populate("teams", "teamName")
    .populate("projectMembers.user", "name email")
    .exec();

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Project details fetched successfully", project)
    );
});

const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { projectName, description, teams, status } = req.body;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  const project = await ProjectModel.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Validate teams if provided
  if (teams && Array.isArray(teams) && teams.length > 0) {
    const validTeams = await TeamModel.find({ _id: { $in: teams } });

    if (validTeams.length !== teams.length) {
      throw new ApiError(400, "One or more team IDs are invalid");
    }

    project.teams = teams;
  }

  // Update fields if provided
  if (projectName) project.projectName = projectName;
  if (description) project.description = description;
  if (status) project.status = status;

  await project.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Project updated successfully", project));
});

// for archive or unarchive the project (//for chnaging the any status we will make other endpoints)
const updateProjectStatus = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { status } = req.body;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  if (!status) {
    throw new ApiError(400, "New status value is required");
  }

  // Only allow archive/unarchive here
  if (!["active", "archived"].includes(status)) {
    throw new ApiError(
      400,
      "Invalid status. You can only archive or unarchive the project via this endpoint"
    );
  }

  const project = await ProjectModel.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  project.status = status;
  await project.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `Project has been ${
          status === "archived" ? "archived" : "restored"
        } successfully`,
        project
      )
    );
});



const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  const project = await ProjectModel.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  await ProjectModel.findByIdAndDelete(projectId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Project deleted successfully", null));
});



//extra controllers.... no need right now...

const updateProjectManager = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { newManagerId } = req.body;

  if (!projectId || !newManagerId) {
    throw new ApiError(400, "Project ID and new manager ID are required");
  }

  const project = await ProjectModel.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Check if user already a member of this project
  const existingMember = project.projectMembers.find(
    (member) => member.user.toString() === newManagerId.toString()
  );

  // Step 1: Remove project-manager role from old manager
  if (project.projectManager) {
    const oldManager = project.projectMembers.find(
      (m) => m.user.toString() === project.projectManager.toString()
    );

    if (oldManager) {
      oldManager.roleInProject = "contributor";
    }
  }

  // Step 2: Add new manager or update role
  if (existingMember) {
    existingMember.roleInProject = "project-manager";
    existingMember.status = "active";
  } else {
    // User not member of project → auto-add
    project.projectMembers.push({
      user: newManagerId,
      roleInProject: "project-manager",
      status: "active",
      addedFromTeam: null,
    });
  }

  // Step 3: Update project-level manager reference
  project.projectManager = newManagerId;

  await project.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Project manager updated successfully", project)
    );
});

export {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  updateProjectStatus,
  deleteProject,
};
