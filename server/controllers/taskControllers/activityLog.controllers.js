import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { TaskActivityLog as TaskActivityLogModel } from "../../models/Task models/taskActivityLog.models.js";

const getTaskActivityTimeline = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    throw new ApiError(400, "Task ID is required");
  }

  // for pagination .. it is optional 
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const logs = await TaskActivityLogModel.find({ task: taskId })
    .sort({ performedAt: -1 }) 
    .skip(skip)
    .limit(limit)
    .populate({
      path: "performedBy",
      select: "name email avatar",
    });

  return res.status(200).json(
    new ApiResponse(200, "Activity timeline fetched successfully", {
      page,
      limit,
      count: logs.length,
      logs,
    })
  );
});

export { getTaskActivityTimeline };