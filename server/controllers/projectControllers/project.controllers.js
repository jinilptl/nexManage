import { Project as ProjectModel } from "../../models/project.models.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { Team as TeamModel } from "../../models/team.models.js";
import { Task as TaskModel } from "../../models/Task models/task.models.js";
import generateRandomHexColor from "../../utils/generateColor.js";

const createProject = asyncHandler(async (req, res) => {
  const { projectName, description, projectType, teams } = req.body;

  if (!projectName) {
    throw new ApiError(400, "Project name is required");
  }

  const validTypes = ["team", "personal", "mixed"];
  if (!projectType || !validTypes.includes(projectType)) {
    throw new ApiError(
      400,
      "Invalid projectType. Allowed: team, personal, mixed",
    );
  }

  if (projectType === "team") {
    if (!teams || !Array.isArray(teams) || teams.length === 0) {
      throw new ApiError(400, "Team projects must include at least one team");
    }
  }

  if (projectType === "personal") {
    if (teams && teams.length > 0) {
      throw new ApiError(400, "Personal projects cannot include teams");
    }
  }

  if (projectType === "mixed") {
    if (teams && !Array.isArray(teams)) {
      throw new ApiError(400, "Teams must be an array");
    }
  }

  let selectedTeams = [];
  if (teams && teams.length > 0) {
    selectedTeams = await TeamModel.find({ _id: { $in: teams } }).populate(
      "members.user",
      "name email",
    );

    if (selectedTeams.length !== teams.length) {
      throw new ApiError(400, "One or more team IDs are invalid");
    }
  }

  const createdBy = req.user?._id;
  if (!createdBy) {
    throw new ApiError(401, "Unauthorized: User not found in request");
  }

  let autoMembers = [];

  selectedTeams.forEach((team) => {
    team.members.forEach((member) => {
      if (!member.user) return;

      autoMembers.push({
        user: member.user._id,
        roleInProject: "contributor",
        addedFromTeam: team._id,
        status: "active",
      });
    });
  });

  const uniqueMembersMap = new Map();

  autoMembers.forEach((m) => {
    const key = m.user.toString();
    if (!uniqueMembersMap.has(key)) {
      uniqueMembersMap.set(key, m);
    }
  });

  autoMembers = Array.from(uniqueMembersMap.values());

  const existingCreator = autoMembers.find(
    (m) => m.user.toString() === createdBy.toString(),
  );

  if (existingCreator) {
    existingCreator.roleInProject = "project-manager";
    existingCreator.addedFromTeam = existingCreator.addedFromTeam || null;
  } else {
    autoMembers.push({
      user: createdBy,
      roleInProject: "project-manager",
      addedFromTeam: null,
      status: "active",
    });
  }

  const DEFAULT_TASK_STATUSES = [
    { key: "todo", label: "To Do", order: 1, isDefault: true },
    { key: "in_progress", label: "In Progress", order: 2 },
    { key: "review", label: "Review", order: 3 },
    { key: "done", label: "Done", order: 4 },
  ];

  const newProject = await ProjectModel.create({
    projectName,
    description: description || "",
    projectType,
    createdBy,

    teams: teams || [],

    projectManager: createdBy,

    projectMembers: autoMembers,
    taskStatuses: DEFAULT_TASK_STATUSES,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Project created successfully", newProject));
});

const PROJECT_STATUS_VALUES = ["ACTIVE", "COMPLETED", "ON_HOLD", "ARCHIVED"];

const getAllProjects = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};

  const normalized = status ? String(status).toUpperCase() : "ACTIVE";

  if (normalized !== "ALL") {
    if (!PROJECT_STATUS_VALUES.includes(normalized)) {
      throw new ApiError(
        400,
        `Invalid status. Allowed: ${PROJECT_STATUS_VALUES.join(", ")}, ALL`,
      );
    }
    filter.status = normalized;
  }

  const projects = await ProjectModel.find(filter)
    .populate("createdBy", "name email")
    .populate("projectManager", "name email")
    .populate("teams", "teamName")
    .populate("projectMembers.user", "name isTempMember")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "All projects fetched successfully", projects));
});

const getUserProjects = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { status } = req.query;

  if (!userId) {
    throw new ApiError(401, "Unauthorized: User not found");
  }

  const filter = {
    $or: [
      { createdBy: userId },
      { projectManager: userId },
      { "projectMembers.user": userId },
    ],
  };

  const normalized = status ? String(status).toUpperCase() : "ACTIVE";

  if (normalized !== "ALL") {
    if (!PROJECT_STATUS_VALUES.includes(normalized)) {
      throw new ApiError(
        400,
        `Invalid status. Allowed: ${PROJECT_STATUS_VALUES.join(", ")}, ALL`,
      );
    }
    filter.status = normalized;
  }

  const projects = await ProjectModel.find(filter)
    .populate("createdBy", "name email")
    .populate("projectManager", "name email")
    .populate("teams", "teamName")
    .populate("projectMembers.user", "name email isTempMember")
    .populate("projectMembers.addedFromTeam", "teamName")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "User projects fetched successfully", projects));
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
    .populate("projectMembers.user", "name email isTempMember")
    .populate("projectMembers.addedFromTeam", "teamName")
    .exec();

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Project details fetched successfully", project),
    );
});

const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { projectName, description, projectType, teams, status } = req.body;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  const project = await ProjectModel.findById(projectId).populate(
    "projectMembers.user",
    "name email role",
  );
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (projectType) {
    const validTypes = ["team", "personal", "mixed"];
    if (!validTypes.includes(projectType)) {
      throw new ApiError(400, "Invalid projectType");
    }
    project.projectType = projectType;
  }

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
    const validTeams = await TeamModel.find({ _id: { $in: teams } }).populate(
      "members.user",
      "name email",
    );

    if (validTeams.length !== teams.length) {
      throw new ApiError(400, "One or more team IDs are invalid");
    }

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

    const memberMap = new Map();
    autoMembers.forEach((m) => memberMap.set(m.user.toString(), m));

    autoMembers = Array.from(memberMap.values());

    const creator = project.createdBy.toString();

    const creatorAlready = autoMembers.find(
      (m) => m.user.toString() === creator,
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

  if (projectName) project.projectName = projectName;
  if (description) project.description = description;
  if (status) {
    const normalized = String(status).toUpperCase();
    if (!PROJECT_STATUS_VALUES.includes(normalized)) {
      throw new ApiError(
        400,
        `Invalid status. Allowed: ${PROJECT_STATUS_VALUES.join(", ")}`,
      );
    }
    project.status = normalized;
  }

  await project.save();

  const updatedProject = await ProjectModel.findById(projectId)
    .populate("createdBy", "name email")
    .populate("projectManager", "name email")
    .populate("teams", "teamName")
    .populate("projectMembers.user", "name email isTempMember")
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

const updateProjectStatus = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId || req.params.id;
  const { status } = req.body;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  if (!status) {
    throw new ApiError(400, "Status value is required");
  }

  const normalized = String(status).toUpperCase();
  if (!PROJECT_STATUS_VALUES.includes(normalized)) {
    throw new ApiError(
      400,
      `Invalid status. Allowed: ${PROJECT_STATUS_VALUES.join(", ")}`,
    );
  }

  const project = req.project || (await ProjectModel.findById(projectId));
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  project.status = normalized;
  await project.save();

  const updatedProjectData = await ProjectModel.findById(projectId)
    .populate("createdBy", "name email")
    .populate("projectManager", "name email")
    .populate("teams", "teamName")
    .populate("projectMembers.user", "name email isTempMember")
    .populate("projectMembers.addedFromTeam", "teamName")
    .exec();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `Project status updated to ${normalized}`,
        updatedProjectData,
      ),
    );
});

const addProjectTaskStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { key, label } = req.body;

    if (!key || !label) {
      throw new ApiError(400, "key and label are required");
    }

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    const alreadyExists = project.taskStatuses.some((s) => s.key === key);

    if (alreadyExists) {
      throw new ApiError(400, "Status key already exists");
    }

    const nextOrder =
      project.taskStatuses.length > 0
        ? Math.max(...project.taskStatuses.map((s) => s.order)) + 1
        : 1;

    const newStatus = {
      key,
      label,
      order: nextOrder,
      color: generateRandomHexColor(),
    };

    project.taskStatuses.push(newStatus);
    await project.save();

    return res
      .status(201)
      .json(new ApiResponse(200, "Task status added successfully", newStatus));
  } catch (error) {
    console.error("Add Task Status Error:", error);
    throw new ApiError(500, "Internal server error");
  }
};

const deleteProjectTaskStatus = async (req, res) => {
  try {
    const { projectId, statusId } = req.params;

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    const statusIndex = project.taskStatuses.findIndex(
      (s) => s._id.toString() === statusId,
    );

    if (statusIndex === -1) {
      throw new ApiError(404, "Task status not found");
    }

    if (project.taskStatuses[statusIndex].isDefault) {
      throw new ApiError(400, "Cannot delete default task status");
    }

    const todoStatus = project.taskStatuses.find((s) => s.key === "todo");
    if (!todoStatus) {
      throw new ApiError(500, "Default To Do status not found in project");
    }

    await TaskModel.updateMany(
      { project: projectId, status: statusId },
      { $set: { status: todoStatus._id } },
    );

    project.taskStatuses.splice(statusIndex, 1);
    await project.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Task status deleted successfully", {
          statusId,
          todoStatusId: todoStatus._id,
        }),
      );
  } catch (error) {
    console.error("Delete Task Status Error:", error);
    throw new ApiError(500, "Internal server error");
  }
};

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

  if (project.projectManager) {
    const oldManager = project.projectMembers.find(
      (m) => m.user._id.toString() === project.projectManager.toString(),
    );

    if (oldManager) {
      oldManager.roleInProject = "contributor";
    }
  }

  let newManager = project.projectMembers.find(
    (m) => m.user._id.toString() === newManagerId.toString(),
  );

  if (!newManager) {
    let addedFromTeam = null;

    for (const team of project.teams) {
      const isMember = team.members?.some(
        (tm) => tm.user?.toString() === newManagerId.toString(),
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
    newManager.roleInProject = "project-manager";
    newManager.status = "active";
  }

  project.projectManager = newManagerId;

  await project.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Project manager updated successfully", project),
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
  updateProjectManager,
  addProjectTaskStatus,
  deleteProjectTaskStatus,
};
