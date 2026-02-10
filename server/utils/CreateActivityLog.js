import mongoose from "mongoose";
import { TaskActivityLog } from "../models/Task models/taskActivityLog.models.js";
import { getIO } from "../socket/index.js";

const createTaskActivityLog = async ({
  taskId,
  projectId,
  action,
  performedBy,
  meta = {},
}) => {
  if (!taskId || !action || !performedBy) {
    throw new Error(
      "taskId, action and performedBy are required to create activity log",
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

  //  try {
  //   const io = getIO();
  //   io.to(`project:${projectId}`).emit("ACTIVITY_LOG_ADDED", {
  //     taskId,
  //     log: {
  //       _id: log._id,
  //       action: log.action,
  //       performedBy: log.performedBy,
  //       performedAt: log.performedAt,
  //       meta: log.meta,
  //     },
  //   });
  // } catch (err) {
  //   console.error("Socket emit failed (ACTIVITY_LOG_ADDED)");
  // }
};

export { createTaskActivityLog };
