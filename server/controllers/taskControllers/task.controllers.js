import asyncHandler from "../../utils/asyncHandler.js";
import { User as UserModel } from "../../models/user.models.js";
import { Project as ProjectModel } from "../../models/project.models.js";
import { Task as TaskModel } from "../../models/Task models/task.models.js";

// import {SubTask} from "../../models/Task models/subTask.models.js";
// import {TaskAttachment} from "../../models/Task models/taskAttachment.models.js";
// import {TaskActivityLog} from "../../models/Task models/taskActivityLog.models.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { createTaskActivityLog } from "../../utils/CreateActivityLog.js";

const createTask = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId;
  const userId = req.user?._id;
  const project = req.project;

  const { title, description, assignees, priority, dueDate } = req.body;

  // Validations


  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  if (!userId) {
    throw new ApiError(401, "Unauthorized user");
  }

  if (!title || title.trim().length < 5) {
    throw new ApiError(
      400,
      "Title is required and should be at least 5 characters long"
    );
  }

  if (!priority || !["low", "medium", "high", "critical"].includes(priority)) {
    throw new ApiError(
      400,
      "Priority must be one of: low, medium, high, critical"
    );
  }

  if (dueDate && new Date(dueDate) < new Date()) {
    throw new ApiError(400, "Due date cannot be in the past");
  }

  if (!Array.isArray(assignees) || assignees.length === 0) {
    throw new ApiError(400, "At least one assignee is required");
  }

  // --------------------
  // Validate assignees
  // --------------------



  // assignee must be active project members check 

  const activeProjectMemberIds = project.projectMembers
    .filter((member) => member.status === "active")
    .map((member) => member.user.toString());

  const isAssigneeValid = assignees.every((assigneeId) =>
    activeProjectMemberIds.includes(assigneeId.toString())
  );

  if (!isAssigneeValid) {
    throw new ApiError(
      400,
      "One or more assignees are not active members of this project"
    );
  }

  //defauult status

  const defaultStatus = project.taskStatuses?.[0] || "To Do";

  const existingTaskCount = await TaskModel.countDocuments({
    project: projectId,
    status: defaultStatus,
  });

  const order = existingTaskCount;

 // task creation 

  const newTask = await TaskModel.create({
    title: title.trim(),
    description: description || "",
    status: defaultStatus,
    priority,
    dueDate: dueDate || null,
    assignees,
    createdBy: userId,
    project: projectId,
    order,
  });



  // Activity log utility function call


  await createTaskActivityLog({
    taskId: newTask._id,
    action: "TASK_CREATED",
    performedBy: userId,
    meta: {
      title: newTask.title,
      priority: newTask.priority,
      assigneesCount: newTask.assignees.length,
    },
  });

  return res.status(201).json(
    new ApiResponse(201, "Task created successfully", newTask)
  );
});


export { createTask };