import mongoose from "mongoose";
import { TaskActivityLog } from "../models/Task models/taskActivityLog.models.js";

const createTaskActivityLog = async ({
  taskId,
  action,
  performedBy,
  meta = {},
}) => {
  if (!taskId || !action || !performedBy) {
    throw new Error(
      "taskId, action and performedBy are required to create activity log"
    );
  }

  if (typeof action !== "string" || action.trim() === "") {
    throw new Error("action must be a non-empty string");
  }

  if (
    !mongoose.Types.ObjectId.isValid(taskId) ||
    !mongoose.Types.ObjectId.isValid(performedBy)
  ) {
    throw new Error("Invalid taskId or performedBy");
  }

  if (meta && (typeof meta !== "object" || Array.isArray(meta))) {
    throw new Error("meta must be a plain object");
  }

  await TaskActivityLog.create({
    task: taskId,
    action: action.trim(),
    performedBy,
    meta: meta || {},
  });
};

export { createTaskActivityLog };
