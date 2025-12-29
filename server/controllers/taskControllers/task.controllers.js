import asyncHandler from "../../utils/asyncHandler.js";
import { User as UserModel } from "../../models/user.models.js";
import { Project as ProjectModel } from "../../models/project.models.js";
import { Task as TaskModel } from "../../models/Task models/task.models.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { createTaskActivityLog } from "../../utils/CreateActivityLog.js";
import { getIO } from "../../socket/index.js";

const createTask = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId;
  const userId = req.user?._id;
  const project = req.project;

  const { title, description, assignees, priority, dueDate } = req.body;

  if (!projectId) throw new ApiError(400, "Project ID is required");
  if (!userId) throw new ApiError(401, "Unauthorized user");

  if (!title || title.trim().length < 5) {
    throw new ApiError(400, "Title must be at least 5 characters");
  }

  if (!priority || !["low", "medium", "high", "critical"].includes(priority)) {
    throw new ApiError(400, "Invalid priority");
  }

  if (dueDate && new Date(dueDate) < new Date()) {
    throw new ApiError(400, "Due date cannot be in the past");
  }

  if (!Array.isArray(assignees) || assignees.length === 0) {
    throw new ApiError(400, "At least one assignee is required");
  }

  // validate assignees
  const activeMemberIds = project.projectMembers
    .filter((m) => m.status === "active")
    .map((m) => m.user.toString());

  const isValid = assignees.every((id) =>
    activeMemberIds.includes(id.toString())
  );

  if (!isValid) {
    throw new ApiError(400, "Invalid assignee(s)");
  }

 
  const defaultStatus =
  project.taskStatuses.find((s) => s.isDefault) ||
  [...project.taskStatuses].sort((a, b) => a.order - b.order)[0];

if (!defaultStatus) {
  throw new ApiError(400, "No task status configured for this project");
}


  const existingCount = await TaskModel.countDocuments({
    project: projectId,
    status: defaultStatus._id,
  });

  const newTask = await TaskModel.create({
    title: title.trim(),
    description: description || "",
    status: defaultStatus._id,
    priority,
    dueDate: dueDate || null,
    assignees,
    createdBy: userId,
    project: projectId,
    order: existingCount,
  });
console.log("ne taskl is ---> ",newTask);

  await createTaskActivityLog({
    taskId: newTask._id,
    projectId,
    action: "TASK_CREATED",
    performedBy: userId,
    meta: {
      title: newTask.title,
      status: defaultStatus.label,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Task created successfully", newTask));
});


const getProjectTasks = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId;

  const project = req.project;

  const { status, priority, assignee } = req.query;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const filter = {
    project: projectId,
  };

  if (status) {
    filter.status = status;
  }

  if (priority) {
    filter.priority = priority;
  }
  if (assignee) {
    filter.assignees = assignee;
  }

  const tasks = await TaskModel.find(filter)
    .sort({ status: 1, order: 1 })
    .populate("assignees", "name email")
    .populate("createdBy", "name email")
    .exec();

  return res
    .status(200)
    .json(new ApiResponse(200, "Tasks fetched successfully", tasks));
});

const getTaskDetails = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;

  if (!taskId) {
    throw new ApiError(400, "Task id is required");
  }

  let task = req.task;

  if (!task) {
    task = await TaskModel.findById(taskId)
      .populate("assignees", "name email")
      .populate("createdBy", "name email")
      .populate("project", "projectName  projectType")
      .exec();

    if (!task) {
      throw new ApiError(404, "Task not found");
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Task details fetched successfully", task));
});

const updateTask = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;
  const userId = req.user?._id;
  const projectId = req.params.projectId;

  console.log("request comes here ");

  if (!taskId) {
    throw new ApiError(400, "Task id is required");
  }
  if (!userId) {
    throw new ApiError(401, "Unauthorized user");
  }
  let task = req.task;
  if (!task) {
    task = await TaskModel.findById(taskId);
    if (!task) {
      throw new ApiError(404, "Task not found");
    }
  }

  const { title, description, priority, dueDate } = req.body;
  console.log("data --> ", title);

  //validations and updation
  let updates = {};

  let meta = {};

  if (title !== undefined) {
    if (!title || title.trim().length < 5) {
      throw new ApiError(400, "Title should be at least 5 characters long");
    }

    updates.title = title.trim();
    meta.title = title.trim();
  }

  if (description !== undefined) {
    updates.description = description;
  }

  if (priority !== undefined) {
    if (!["low", "medium", "high", "critical"].includes(priority)) {
      throw new ApiError(
        400,
        "Priority must be one of: low, medium, high, critical"
      );
    }
    updates.priority = priority;
    meta.priority = priority;
  }

  if (dueDate !== undefined) {
    if (dueDate && new Date(dueDate) < new Date()) {
      throw new ApiError(400, "Due date cannot be in the past");
    }
    updates.dueDate = dueDate || null;
    meta.dueDate = dueDate || null;
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No valid fields provided for update");
  }

  // console.log("request comes here above updation");

  const updatedTask = await TaskModel.findByIdAndUpdate(
    taskId,
    { $set: updates },
    { new: true }
  );

  //  console.log("request comes here after updation");

  // activity log utility function call
  await createTaskActivityLog({
    taskId: updatedTask._id,
    projectId: projectId,
    action: "TASK_UPDATED",
    performedBy: userId,
    meta,
  });

  try {
    const io = getIO();

    io.to(`project:${projectId}`).emit("TASK_UPDATED", {
      taskId: updatedTask._id,
      updates,
    });
  } catch (error) {
    console.error("Socket emit failed (TASK_UPDATED)", error.message);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Task Updated successfully", updatedTask));
});

// one column to another column
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { taskId, projectId } = req.params;
  const userId = req.user._id;
  const { statusId } = req.body;

  const project = req.project;
  const task = req.task;

  if (!statusId) throw new ApiError(400, "statusId is required");

  const targetStatus = project.taskStatuses.find(
    (s) => s._id.toString() === statusId
  );

  if (!targetStatus) {
    throw new ApiError(400, "Invalid task status");
  }

  if (task.status.toString() === statusId) {
    return res.status(200).json(
      new ApiResponse(200, "Status unchanged", task)
    );
  }

  const oldStatusId = task.status;
  const oldOrder = task.order;

  // FIX SOURCE COLUMN GAP
  await TaskModel.updateMany(
    {
      project: task.project,
      status: oldStatusId,
      order: { $gt: oldOrder },
    },
    { $inc: { order: -1 } }
  );

  const targetCount = await TaskModel.countDocuments({
    project: task.project,
    status: statusId,
  });

  const updatedTask = await TaskModel.findByIdAndUpdate(
    taskId,
    {
      status: statusId,
      order: targetCount,
    },
    { new: true }
  );

  await createTaskActivityLog({
    taskId: task._id,
    projectId,
    action: "TASK_STATUS_UPDATED",
    performedBy: userId,
    meta: {
      from: oldStatusId,
      to: statusId,
    },
  });

  return res.status(200).json(
    new ApiResponse(200, "Task status updated", updatedTask)
  );
});


//in same column reorder
const updateTaskOrder = asyncHandler(async (req, res) => {
  const { order: newOrder } = req.body;
  const userId = req.user._id;
  const projectId = req.params.projectId;

  if (newOrder === undefined || newOrder < 0) {
    throw new ApiError(400, "Valid newOrder is required");
  }

  const task = req.task;
  const oldOrder = task.order;
  const status = task.status;

  // No movement
  if (newOrder === oldOrder) {
    return res.status(200).json(new ApiResponse(200, "Order unchanged", task));
  }

  // CASE 1: Task moves UP from down
  //  oldOrder = 4 → newOrder = 1
  //  Tasks [1 → 3] move DOWN (+1)

  if (newOrder < oldOrder) {
    await TaskModel.updateMany(
      {
        project: task.project,
        status,
        order: { $gte: newOrder, $lt: oldOrder },
      },
      { $inc: { order: 1 } }
    );
  }

  // CASE 2: Task moves DOWN from up
  // oldOrder = 1 → newOrder = 4
  // Tasks [2 → 4] move UP (-1)

  if (newOrder > oldOrder) {
    await TaskModel.updateMany(
      {
        project: task.project,
        status,
        order: { $gt: oldOrder, $lte: newOrder },
      },
      { $inc: { order: -1 } }
    );
  }

  // UPDATE MOVED TASK

  const updatedTask = await TaskModel.findByIdAndUpdate(
    task._id,
    { order: newOrder },
    { new: true }
  );

  // ACTIVITY LOG

  await createTaskActivityLog({
    taskId: task._id,
    projectId: projectId,
    action: "TASK_REORDERED",
    performedBy: userId,
    meta: {
      from: oldOrder,
      to: newOrder,
      status,
    },
  });

  try {
    const io = getIO();

    io.to(`project:${task.project}`).emit("TASK_REORDERED", {
      taskId: updatedTask._id,
      fromOrder: oldOrder,
      toOrder: newOrder,
      status,
    });
  } catch (error) {
    console.error("Socket emit failed (TASK_REORDERED)", error.message);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Task order updated successfully", updatedTask));
});

// delete task with proper reorder logics and activity log
const deleteTask = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const task = req.task; // attached by middleware

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const { status, order, project } = task;

  // DELETE TASK

  await TaskModel.findByIdAndDelete(task._id);

  // REORDER TASKS IN THE SAME COLUMN
  await TaskModel.updateMany(
    {
      project,
      status,
      order: { $gt: order },
    },
    { $inc: { order: -1 } }
  );

  // ACTIVITY LOG

  await createTaskActivityLog({
    taskId: task._id,
    projectId: project,
    action: "TASK_DELETED",
    performedBy: userId,
    meta: {
      title: task.title,
      status,
    },
  });

  try {
    const io = getIO();

    io.to(`project:${project}`).emit("TASK_DELETED", {
      taskId: task._id,
      status,
      order,
    });
  } catch (error) {
    console.error("Socket emit failed (TASK_DELETED)", error.message);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Task deleted successfully"));
});

//updateTaskAssignees

const updateTaskAssignees = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const task = req.task;
  const project = req.project;

  const { assignees } = req.body;

  if (!Array.isArray(assignees) || assignees.length === 0) {
    throw new ApiError(400, "Assignees must be a non-empty array");
  }

  //  Get active project member IDs

  const activeProjectMemberIds = project.projectMembers
    .filter((member) => member.status === "active")
    .map((member) => member.user.toString());

  //  Validate all assignees

  const areAssigneesValid = assignees.every((assigneeId) =>
    activeProjectMemberIds.includes(assigneeId.toString())
  );

  if (!areAssigneesValid) {
    throw new ApiError(
      400,
      "One or more assignees are not active project members"
    );
  }

  //  detect added & removed assignees for meta track

  const previousAssignees = task.assignees.map((id) => id.toString());
  const newAssignees = assignees.map((id) => id.toString());

  const addedAssignees = newAssignees.filter(
    (id) => !previousAssignees.includes(id)
  );

  const removedAssignees = previousAssignees.filter(
    (id) => !newAssignees.includes(id)
  );

  //  Update task

  const updatedTask = await TaskModel.findByIdAndUpdate(
    task._id,
    { assignees: newAssignees },
    { new: true }
  );

  // Activity log

  await createTaskActivityLog({
    taskId: task._id,
    projectId: project._id,
    action: "ASSIGNEES_UPDATED",
    performedBy: userId,
    meta: {
      added: addedAssignees,
      removed: removedAssignees,
    },
  });

  try {
    const io = getIO();

    io.to(`project:${task.project}`).emit("TASK_ASSIGNEES_UPDATED", {
      taskId: task._id,
      added: addedAssignees,
      removed: removedAssignees,
    });
  } catch (error) {
    console.error("Socket emit failed (TASK_ASSIGNEES_UPDATED)", error.message);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Task assignees updated successfully", updatedTask)
    );
});

export {
  createTask,
  getProjectTasks,
  getTaskDetails,
  updateTask,
  updateTaskStatus,
  updateTaskOrder,
  deleteTask,
  updateTaskAssignees,
};
