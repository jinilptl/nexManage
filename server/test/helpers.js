import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import { Team } from "../models/team.models.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/Task models/task.models.js";
import { SubTask } from "../models/Task models/subTask.models.js";
import { TaskAttachment } from "../models/Task models/taskAttachment.models.js";
import { TaskActivityLog } from "../models/Task models/taskActivityLog.models.js";

export const createTestUser = async (overrides = {}) => {
    const password = overrides.password || "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
        name: overrides.name || "Test User",
        email: overrides.email || `testuser-${Date.now()}@test.com`,
        password: hashedPassword,
        role: overrides.role || "member",
        isTempMember: overrides.isTempMember || false,
        isObserver: overrides.isObserver || false,
        isInvited: overrides.isInvited || false,
        ...overrides,
    };

    if (overrides.password) {
        userData.password = await bcrypt.hash(overrides.password, 10);
    }

    const user = await User.create(userData);

    const tokenPayload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isTempMember: user.isTempMember,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    return { user, token, plainPassword: password };
};

export const createTestTeam = async (creatorId, overrides = {}) => {
    const teamData = {
        teamName: overrides.teamName || `Team-${Date.now()}`,
        description: overrides.description || "Test team description",
        createdby: creatorId,
        members: overrides.members || [],
        status: overrides.status || "ACTIVE",
        isActive: overrides.isActive !== undefined ? overrides.isActive : true,
    };

    return await Team.create(teamData);
};

export const createTestProject = async (creatorId, overrides = {}) => {
    const DEFAULT_TASK_STATUSES = [
        { key: "todo", label: "To Do", order: 1, isDefault: true, color: "#6366f1" },
        { key: "in_progress", label: "In Progress", order: 2, color: "#f59e0b" },
        { key: "review", label: "Review", order: 3, color: "#3b82f6" },
        { key: "done", label: "Done", order: 4, color: "#22c55e" },
    ];

    const projectData = {
        projectName: overrides.projectName || `Project-${Date.now()}`,
        description: overrides.description || "Test project",
        projectType: overrides.projectType || "team",
        createdBy: creatorId,
        projectManager: creatorId,
        teams: overrides.teams || [],
        projectMembers: overrides.projectMembers || [
            {
                user: creatorId,
                roleInProject: "project-manager",
                status: "active",
                addedFromTeam: null,
            },
        ],
        taskStatuses: overrides.taskStatuses || DEFAULT_TASK_STATUSES,
        status: overrides.status || "ACTIVE",
    };

    return await Project.create(projectData);
};

export const createTestTask = async (projectId, creatorId, statusId, overrides = {}) => {
    const taskData = {
        title: overrides.title || "Test Task Title",
        description: overrides.description || "Test task description",
        priority: overrides.priority || "medium",
        status: statusId,
        project: projectId,
        createdBy: creatorId,
        updatedBy: creatorId,
        assignees: overrides.assignees || [creatorId],
        order: overrides.order || 0,
        dueDate: overrides.dueDate || null,
        ...overrides,
    };

    return await Task.create(taskData);
};

export const createTestSubTask = async (taskId, overrides = {}) => {
    const subTaskData = {
        task: taskId,
        title: overrides.title || "Test SubTask",
        completed: overrides.completed || false,
        completedAt: overrides.completedAt || null,
        completedBy: overrides.completedBy || null,
    };

    return await SubTask.create(subTaskData);
};

export const generateObjectId = () => new mongoose.Types.ObjectId();

export const authHeader = (token) => `Bearer ${token}`;
