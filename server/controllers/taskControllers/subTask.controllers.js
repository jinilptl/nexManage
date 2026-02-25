import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { createTaskActivityLog } from "../../utils/CreateActivityLog.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { Task as TaskModel } from "../../models/Task models/task.models.js";
import { SubTask as SubTaskModel } from "../../models/Task models/subTask.models.js";
import { getIO } from "../../socket/index.js";

const addSubTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title } = req.body;
  const userId = req.user?._id;
  const projectId = req.params.projectId;

  if (!taskId) {
    throw new ApiError(400, "Task ID is required");
  }

  if (!userId) {
    throw new ApiError(401, "Unauthorized user");
  }

  if (!title || title.trim() === "") {
    throw new ApiError(400, "Subtask title is required");
  }

  let task = req.task;

  if (!task) {
    task = await TaskModel.findById(taskId);
    if (!task) {
      throw new ApiError(404, "Task not found");
    }
  }

  const subTask = await SubTaskModel.create({
    task: task._id,
    title: title.trim(),
    isCompleted: false,
    completedAt: null,
    completedBy: null,
  });

  await createTaskActivityLog({
    taskId: task._id,
    projectId: projectId,
    action: "SUBTASK_CREATED",
    performedBy: userId,
    meta: {
      subTaskId: subTask._id,
      title: subTask.title,
    },
  });

  const populatedSubTask = await SubTaskModel.findById(subTask._id).populate({
    path: "task",
    select: "title status priority",
  });

  try {
    const io = getIO();

    io.to(`project:${task.project}`).emit("SUBTASK_CREATED", {
      taskId: task._id,
      subTask: {
        _id: subTask._id,
        title: subTask.title,
        isCompleted: subTask.isCompleted,
        createdAt: subTask.createdAt,
      },
    });
  } catch (error) {
    console.error("Socket emit failed (SUBTASK_CREATED)", error.message);
  }

  return res.status(201).json(
    new ApiResponse(201, "Subtask added successfully", {
      subTask: populatedSubTask,
    }),
  );
});

const updateSubTask = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { subTaskId } = req.params;
  const { title, description } = req.body;
  const projectId = req.params.projectId;

  let subTask = req.subTask;

  if (!subTask) {
    subTask = await SubTaskModel.findById(subTaskId);
    if (!subTask) {
      throw new ApiError(404, "Subtask not found");
    }
  }

  if ((!title || title.trim() === "") && description === undefined) {
    throw new ApiError(400, "Nothing to update");
  }

  const updates = {};
  const meta = {};

  if (title !== undefined) {
    if (!title || title.trim() === "") {
      throw new ApiError(400, "Subtask title cannot be empty");
    }
    updates.title = title.trim();
    meta.title = updates.title;
  }

  if (description !== undefined) {
    updates.description = description ? description.trim() : "";
    meta.description = updates.description;
  }

  const updatedSubTask = await SubTaskModel.findByIdAndUpdate(
    subTaskId,
    { $set: updates },
    { new: true },
  ).populate({
    path: "task",
    select: "title status priority",
  });

  await createTaskActivityLog({
    taskId: subTask.task,
    projectId: projectId,
    action: "SUBTASK_UPDATED",
    performedBy: userId,
    meta,
  });

  try {
    const io = getIO();

    io.to(`project:${updatedSubTask.task}`).emit("SUBTASK_UPDATED", {
      taskId: updatedSubTask.task,
      subTaskId: updatedSubTask._id,
      updates,
    });
  } catch (error) {
    console.error("Socket emit failed (SUBTASK_UPDATED)", error.message);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Subtask updated successfully", updatedSubTask));
});

const toggleSubTaskCompletion = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { subTaskId } = req.params;
  const projectId = req.params.projectId;

  const { isCompleted } = req.body;

  let subTask = req.subTask;

  if (!subTask) {
    subTask = await SubTaskModel.findById(subTaskId);
    if (!subTask) {
      throw new ApiError(404, "Subtask not found");
    }
  }

  const targetState =
    typeof isCompleted === "boolean" ? isCompleted : !subTask.completed;

  if (subTask.completed === targetState) {
    return res
      .status(200)
      .json(new ApiResponse(200, "Subtask status unchanged", subTask));
  }

  const updates = {
    completed: targetState,
    completedAt: targetState ? new Date() : null,
    completedBy: targetState ? userId : null,
  };

  const updatedSubTask = await SubTaskModel.findByIdAndUpdate(
    subTask._id,
    { $set: updates },
    { new: true },
  ).populate({
    path: "task",
    select: "title status priority",
  });

  await createTaskActivityLog({
    taskId: subTask.task,
    projectId: projectId,
    action: targetState ? "SUBTASK_COMPLETED" : "SUBTASK_UNCOMPLETED",
    performedBy: userId,
    meta: {
      subTaskId: subTask._id,
      completed: targetState,
    },
  });

  try {
    const io = getIO();

    io.to(`project:${projectId}`).emit("SUBTASK_COMPLETION_CHANGED", {
      taskId: subTask.task,
      subTaskId,
      isCompleted: targetState,
    });
  } catch (error) {
    console.error("Socket emit failed (SUBTASK_COMPLETION_CHANGED)", error.message);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        targetState
          ? "Subtask marked as completed"
          : "Subtask marked as uncompleted",
        updatedSubTask,
      ),
    );
});

const deleteSubTask = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { subTaskId } = req.params;
  const projectId = req.params.projectId;

  let subTask = req.subTask;

  if (!subTask) {
    subTask = await SubTaskModel.findById(subTaskId);
    if (!subTask) {
      throw new ApiError(404, "Subtask not found");
    }
  }

  const taskId = subTask.task;
  const subTaskTitle = subTask.title;

  await SubTaskModel.findByIdAndDelete(subTask._id);

  await createTaskActivityLog({
    taskId,
    projectId: projectId,
    action: "SUBTASK_DELETED",
    performedBy: userId,
    meta: {
      subTaskId,
      title: subTaskTitle,
    },
  });

  try {
    const io = getIO();

    io.to(`project:${projectId}`).emit("SUBTASK_DELETED", {
      taskId,
      subTaskId,
    });
  } catch (error) {
    console.error("Socket emit failed (SUBTASK_DELETED)", error.message);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Subtask deleted successfully"));
});

const getAllSubtask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = req.task;

  if (!taskId) {
    throw new ApiError(400, "Task ID is required");
  }

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const subtasks = await SubTaskModel.find({ task: taskId })
    .sort({ createdAt: 1 })
    .populate({
      path: "completedBy",
      select: "name email",
    });

  return res
    .status(200)
    .json(new ApiResponse(200, "Subtasks fetched successfully", subtasks));
});

export {
  addSubTask,
  updateSubTask,
  toggleSubTaskCompletion,
  deleteSubTask,
  getAllSubtask,
};