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

  const updatedTask = await TaskModel.findByIdAndUpdate(
    taskId,
    { $set: updates },
    { new: true }
  );

  // activity log utility function call
  await createTaskActivityLog({
    taskId: updatedTask._id,
    action: "TASK_UPDATED",
    performedBy: userId,
    meta,
  });
});


// one column to another column
const updateTaskStatus = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;
  const userId = req.user?._id;
  const { status: newStatus } = req.body;

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
  if (!newStatus) {
    throw new ApiError(400, "Status is required");
  }

  // if not chnageble status then
  if (task.status === newStatus) {
    return res.status(200).json(new ApiResponse(200, "Status unchanged", task));
  }

  //  previous status for activity log
  const oldStatus = task.status;
  const oldOrder = task.order;

  //FIX SOURCE COLUMN
  //move one step UP (order - 1)
  //we set old order to all tasks which are in same project and same status and order greater than this task order so that there is no gap in order or no conflict in order

  await TaskModel.updateMany(
    {
      project: task.project,
      status: oldStatus,
      order: { $gt: oldOrder },
    },
    { $inc: { order: -1 } }
  );

  //for order calculation for set this task at the end of column
  //Determine new order = end of target column

  const targetColumnCount = await TaskModel.countDocuments({
    project: task.project,
    status: newStatus,
  });

  // updation of status

  const updatedTask = await TaskModel.findByIdAndUpdate(
    taskId,
    { $set: { status: newStatus, order: targetColumnCount } },
    { new: true }
  );

  //crete activity log
  await createTaskActivityLog({
    taskId: task._id,
    action: "TASK_STATUS_UPDATED",
    performedBy: userId,
    meta: {
      from: oldStatus,
      to: newStatus,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Task status updated successfully", updatedTask)
    );
});


//in same column reorder
const updateTaskOrder = asyncHandler(async (req, res) => {
  const { newOrder } = req.body;
  const userId = req.user._id;

  if (newOrder === undefined || newOrder < 0) {
    throw new ApiError(400, "Valid newOrder is required");
  }

  const task = req.task;
  const oldOrder = task.order;
  const status = task.status;

  // No movement
  if (newOrder === oldOrder) {
    return res.status(200).json(
      new ApiResponse(200, "Order unchanged", task)
    );
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
    action: "TASK_REORDERED",
    performedBy: userId,
    meta: {
      from: oldOrder,
      to: newOrder,
      status,
    },
  });

  return res.status(200).json(
    new ApiResponse(200, "Task order updated successfully", updatedTask)
  );
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
    action: "TASK_DELETED",
    performedBy: userId,
    meta: {
      title: task.title,
      status,
    },
  });

  return res.status(200).json(
    new ApiResponse(200, "Task deleted successfully")
  );
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
    action: "ASSIGNEES_UPDATED",
    performedBy: userId,
    meta: {
      added: addedAssignees,
      removed: removedAssignees,
    },
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      "Task assignees updated successfully",
      updatedTask
    )
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
  updateTaskAssignees
};
