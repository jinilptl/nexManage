import { Project as ProjectModel } from "../../models/project.models.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { Team as TeamModel } from "../../models/team.models.js";

const createProject = asyncHandler(async (req, res) => {
  const { projectName, description, projectType, teams } = req.body;

  if (!projectName) {
    throw new ApiError(400, "Project name is required");
  }

  const validTypes = ["team", "personal", "mixed"];
  if (!projectType || !validTypes.includes(projectType)) {
    throw new ApiError(
      400,
      "Invalid projectType. Allowed: team, personal, mixed"
    );
  }

  if (projectType === "team") {
    // Team projects require at least 1 team
    if (!teams || !Array.isArray(teams) || teams.length === 0) {
      throw new ApiError(400, "Team projects must include at least one team");
    }
  }

  if (projectType === "personal") {
    // Personal must NOT have teams
    if (teams && teams.length > 0) {
      throw new ApiError(400, "Personal projects cannot include teams");
    }
  }

  if (projectType === "mixed") {
    // Mixed MAY have zero or more teams
    if (teams && !Array.isArray(teams)) {
      throw new ApiError(400, "Teams must be an array");
    }
  }

  // VALIDATE TEAMS (ONLY IF PROVIDED)

  let selectedTeams = [];
  if (teams && teams.length > 0) {
    selectedTeams = await TeamModel.find({ _id: { $in: teams } }).populate(
      "members.user",
      "name email"
    );

    if (selectedTeams.length !== teams.length) {
      throw new ApiError(400, "One or more team IDs are invalid");
    }
  }

  const createdBy = req.user?._id;
  if (!createdBy) {
    throw new ApiError(401, "Unauthorized: User not found in request");
  }

  // AUTO IMPORT TEAM MEMBERS

  let autoMembers = [];

  selectedTeams.forEach((team) => {
    team.members.forEach((member) => {
      autoMembers.push({
        user: member.user._id,
        roleInProject: "contributor", // team roles do NOT map to project roles
        addedFromTeam: team._id,
        status: "active",
      });
    });
  });

  // REMOVE DUPLICATE USERS

  const uniqueMembersMap = new Map();

  autoMembers.forEach((m) => {
    const key = m.user.toString();
    if (!uniqueMembersMap.has(key)) {
      uniqueMembersMap.set(key, m);
    }
  });

  // console.log("map result for uniquememeber---> ", uniqueMembersMap);

  autoMembers = Array.from(uniqueMembersMap.values());

  // console.log("converted in to array result in map ---> ", autoMembers);

  // If creator already exists from team → update their role
  const existingCreator = autoMembers.find(
    (m) => m.user.toString() === createdBy.toString()
  );

  if (existingCreator) {
    existingCreator.roleInProject = "project-manager";
    existingCreator.addedFromTeam = existingCreator.addedFromTeam || null;
  } else {
    // Add creator manually
    autoMembers.push({
      user: createdBy,
      roleInProject: "project-manager",
      addedFromTeam: null,
      status: "active",
    });
  }

  // CREATE PROJECT

  const newProject = await ProjectModel.create({
    projectName,
    description: description || "",
    projectType,
    createdBy,

    teams: teams || [],

    projectManager: createdBy,

    projectMembers: autoMembers,
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
    .populate("projectMembers.user", "name")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "All projects fetched successfully", projects));
});




const getUserProjects = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized: User not found");
  }

  const projects = await ProjectModel.find({
    $or: [
      { createdBy: userId },
      { projectManager: userId },
      { "projectMembers.user": userId }
    ]
  })
    .populate("createdBy", "name email")
    .populate("projectManager", "name email")
    .populate("teams", "teamName")
    .populate("projectMembers.user", "name email")
    .populate("projectMembers.addedFromTeam", "teamName")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, "User projects fetched successfully", projects)
  );
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
    .populate("projectMembers.addedFromTeam", "teamName")
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
  const { projectName, description, projectType, teams, status } = req.body;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  const project = await ProjectModel.findById(projectId).populate(
    "projectMembers.user","name email role"
  );
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // VALIDATE PROJECT TYPE

  if (projectType) {
    const validTypes = ["team", "personal", "mixed"];
    if (!validTypes.includes(projectType)) {
      throw new ApiError(400, "Invalid projectType");
    }
    project.projectType = projectType;
  }

  // VALIDATE TEAMS BASED ON TYPE

  if (project.projectType === "team") {
    if (!teams || !Array.isArray(teams) || teams.length === 0) {
      throw new ApiError(400, "Team projects must include at least one team");
    }
  }

  if (project.projectType === "personal") {
    if (teams && teams.length > 0) {
      throw new ApiError(400, "Personal projects cannot include teams");
    }
  }

  if (teams && teams.length > 0) {
    // validate teams
    const validTeams = await TeamModel.find({ _id: { $in: teams } }).populate(
      "members.user",
      "name email"
    );

    if (validTeams.length !== teams.length) {
      throw new ApiError(400, "One or more team IDs are invalid");
    }

    // auto import team members again (reset logic)
    let autoMembers = [];

    validTeams.forEach((team) => {
      team.members.forEach((mem) => {
        autoMembers.push({
          user: mem.user._id,
          roleInProject: "contributor",
          addedFromTeam: team._id,
          status: "active",
        });
      });
    });

    // de-duplicate
    const memberMap = new Map();
    autoMembers.forEach((m) => memberMap.set(m.user.toString(), m));

    autoMembers = Array.from(memberMap.values());

    // keep creator as PM
    const creator = project.createdBy.toString();

    const creatorAlready = autoMembers.find(
      (m) => m.user.toString() === creator
    );

    if (creatorAlready) {
      creatorAlready.roleInProject = "project-manager";
      creatorAlready.addedFromTeam = creatorAlready.addedFromTeam || null;
    } else {
      autoMembers.push({
        user: creator,
        roleInProject: "project-manager",
        addedFromTeam: null,
      });
    }

    project.projectMembers = autoMembers;
    project.teams = teams;
  }

  // BASIC FIELD UPDATES

  if (projectName) project.projectName = projectName;
  if (description) project.description = description;
  if (status) project.status = status;

  await project.save();

  const updatedProject=await ProjectModel.findById(projectId)
    .populate("createdBy", "name email")
    .populate("projectManager", "name email")
    .populate("teams", "teamName")
    .populate("projectMembers.user", "name email")
    .populate("projectMembers.addedFromTeam", "teamName")
    .exec();

  return res
    .status(200)
    .json(new ApiResponse(200, "Project updated successfully", updatedProject));
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

// for archive or unarchive the project (//for chnaging the any status we will make other endpoints)
const updateProjectStatus = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { status } = req.body;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  if (!status) {
    throw new ApiError(400, "Status value is required");
  }

  // Only allow archive/unarchive here
  if (!["active", "onhold", "completed", "archived"].includes(status)) {
    throw new ApiError(
      400,
      "Invalid status. Use this endpoint ONLY for active, onhold, completed, archived "
    );
  }

  const project = await ProjectModel.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Update status
  project.status = status;
  await project.save();

  const updatedProjectData=await ProjectModel.findById(projectId)
    .populate("createdBy", "name email")
    .populate("projectManager", "name email")
    .populate("teams", "teamName")
    .populate("projectMembers.user", "name email")
    .populate("projectMembers.addedFromTeam", "teamName")
    .exec();


  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `Project has been ${
          status 
        } successfully`,
        updatedProjectData
      )
    );
});

//extra controllers.... no need right now...

const updateProjectManager = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { newManagerId } = req.body;

  if (!projectId || !newManagerId) {
    throw new ApiError(400, "Project ID and new manager ID are required");
  }

  const project = await ProjectModel.findById(projectId)
    .populate("teams")
    .populate("projectMembers.user");

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // STEP 1: REMOVE OLD MANAGER ROLE

  if (project.projectManager) {
    const oldManager = project.projectMembers.find(
      (m) => m.user._id.toString() === project.projectManager.toString()
    );

    if (oldManager) {
      oldManager.roleInProject = "contributor";
    }
  }

  // STEP 2: CHECK IF NEW MANAGER ALREADY MEMBER

  let newManager = project.projectMembers.find(
    (m) => m.user._id.toString() === newManagerId.toString()
  );

  if (!newManager) {
    // USER IS NOT PROJECT MEMBER → AUTO ADD

    // Find if user belongs to any project team
    let addedFromTeam = null;

    for (const team of project.teams) {
      const isMember = team.members?.some(
        (tm) => tm.user?.toString() === newManagerId.toString()
      );
      if (isMember) {
        addedFromTeam = team._id;
        break;
      }
    }

    newManager = {
      user: newManagerId,
      roleInProject: "project-manager",
      addedFromTeam: addedFromTeam,
      status: "active",
    };

    project.projectMembers.push(newManager);
  } else {
    // USER ALREADY MEMBER → JUST UPDATE ROLE

    newManager.roleInProject = "project-manager";
    newManager.status = "active";

    // keep addedFromTeam same
  }

  // STEP 3: UPDATE MAIN PM FIELD

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
  getUserProjects,
  updateProjectManager
};
