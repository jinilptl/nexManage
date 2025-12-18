import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { createTaskActivityLog } from "../../utils/CreateActivityLog.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { User as UserModel } from "../../models/user.models.js";
import { Project as ProjectModel } from "../../models/project.models.js";
import { Task as TaskModel } from "../../models/Task models/task.models.js";
import { SubTask as SubTaskModel } from "../../models/Task models/subTask.models.js";
import { useId } from "react";

const addSubTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description } = req.body;
  const userId = req.user?._id;

  // Validations

  if (!taskId) {
    throw new ApiError(400, "Task ID is required");
  }

  if (!userId) {
    throw new ApiError(401, "Unauthorized user");
  }

  if (!title || title.trim() === "") {
    throw new ApiError(400, "Subtask title is required");
  }

  // Task context (from middleware or fallback)

  let task = req.task;

  if (!task) {
    task = await TaskModel.findById(taskId);
    if (!task) {
      throw new ApiError(404, "Task not found");
    }
  }

  // Create SubTask

  const subTask = await SubTaskModel.create({
    task: task._id,
    title: title.trim(),
    description: description ? description.trim() : "",
    isCompleted: false,
    completedAt: null,
    completedBy: null,
  });

  // Activity Log

  await createTaskActivityLog({
    taskId: task._id,
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

  return res.status(201).json(
    new ApiResponse(201, "Subtask added successfully", {
      subTask: populatedSubTask,
    })
  );
});

const updateSubTask = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { subTaskId } = req.params;
  const { title, description } = req.body;

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

  // Title update

  if (title !== undefined) {
    if (!title || title.trim() === "") {
      throw new ApiError(400, "Subtask title cannot be empty");
    }
    updates.title = title.trim();
    meta.title = updates.title;
  }

  // Description update

  if (description !== undefined) {
    updates.description = description ? description.trim() : "";
    meta.description = updates.description;
  }

  const updatedSubTask = await SubTaskModel.findByIdAndUpdate(
    subTaskId,
    { $set: updates },
    { new: true }
  ).populate({
    path: "task",
    select: "title status priority",
  });

  await createTaskActivityLog({
    taskId: subTask.task,
    action: "SUBTASK_UPDATED",
    performedBy: userId,
    meta,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Subtask updated successfully", updatedSubTask));
});

const toggleSubTaskCompletion = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { subTaskId } = req.params;

  const { isCompleted } = req.body;

  let subTask = req.subTask;

  if (!subTask) {
    subTask = await SubTaskModel.findById(subTaskId);
    if (!subTask) {
      throw new ApiError(404, "Subtask not found");
    }
  }

  const targetState =
    typeof isCompleted === "boolean" ? isCompleted : !subTask.isCompleted;

  if (subTask.isCompleted === targetState) {
    return res
      .status(200)
      .json(new ApiResponse(200, "Subtask status unchanged", subTask));
  }

  const updates = {
    isCompleted: targetState,
    completedAt: targetState ? new Date() : null,
    completedBy: targetState ? userId : null,
  };

  const updatedSubTask = await SubTaskModel.findByIdAndUpdate(
    subTask._id,
    { $set: updates },
    { new: true }
  ).populate({
    path: "task",
    select: "title status priority",
  });

  await createTaskActivityLog({
    taskId: subTask.task,
    action: targetState ? "SUBTASK_COMPLETED" : "SUBTASK_UNCOMPLETED",
    performedBy: userId,
    meta: {
      subTaskId: subTask._id,
      completed: targetState,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        targetState
          ? "Subtask marked as completed"
          : "Subtask marked as uncompleted",
        updatedSubTask
      )
    );
});



const deleteSubTask = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { subTaskId } = req.params;

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

  // Activity log
  await createTaskActivityLog({
    taskId,
    action: "SUBTASK_DELETED",
    performedBy: userId,
    meta: {
      subTaskId,
      title: subTaskTitle,
    },
  });

  return res.status(200).json(
    new ApiResponse(200, "Subtask deleted successfully")
  );
});
export { addSubTask, updateSubTask ,toggleSubTaskCompletion,deleteSubTask};
