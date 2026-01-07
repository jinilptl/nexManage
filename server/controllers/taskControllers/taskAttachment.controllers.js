import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { createTaskActivityLog } from "../../utils/CreateActivityLog.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { User as UserModel } from "../../models/user.models.js";
import { Project as ProjectModel } from "../../models/project.models.js";
import { Task as TaskModel } from "../../models/Task models/task.models.js";
import { TaskAttachment as TaskAttachmentModel } from "../../models/Task models/taskAttachment.models.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { getIO } from "../../socket/index.js";


const addTaskAttachment = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user?._id;
  const projectId=req.params.projectId;
  let task = req.task;

  const { attachmentType, fileName, fileUrl } = req.body;
 
  

  if (!userId) {
    throw new ApiError(401, "Unauthorized user");
  }

  if (!taskId) {
    throw new ApiError(400, "Task ID is required");
  }

  if (!task) {
    task = await TaskModel.findById(taskId);
    if (!task) {
      throw new ApiError(404, "Task not found");
    }
  }

  
  // FILE ATTACHMENT
 
  if (attachmentType === "file") {
    if (!req.file) {
      throw new ApiError(400, "File is required");
    }

    const uploadResult = await uploadOnCloudinary(
      req.file.path,
      `nexmanage/tasks/${taskId}/attachments`
    );

    if (!uploadResult) {
      throw new ApiError(500, "File upload failed");
    }

    const attachment = await TaskAttachmentModel.create({
      task: task._id,
      attachmentType: "file",
      fileUrl: uploadResult.url,
      fileName: uploadResult.fileName,
      publicId: uploadResult.publicId,
      uploadedBy: userId,
    });

    await createTaskActivityLog({
      taskId: task._id,
      projectId:projectId,
      action: "ATTACHMENT_ADDED",
      performedBy: userId,
      meta: {
        type: "file",
        fileName: attachment.fileName,
      },
    });

    const populatedResult = await TaskAttachmentModel.findById(
      attachment._id
    )
      .populate("task", "title status")
      .populate("uploadedBy", "name email");

      try {
  const io = getIO();

  io.to(`project:${task.project}`).emit("ATTACHMENT_ADDED", {
    taskId: task._id,
    attachment: {
      _id: attachment._id,
      attachmentType: attachment.attachmentType,
      fileName: attachment.fileName,
      fileUrl: attachment.fileUrl,
      uploadedBy: attachment.uploadedBy,
      createdAt: attachment.createdAt,
    },
  });
} catch (error) {
  console.error("Socket emit failed (ATTACHMENT_ADDED)", error.message);
}


    return res.status(201).json(
      new ApiResponse(201, "File attached successfully", {
        attachment: populatedResult,
      })
    );
  }

  
  // URL ATTACHMENT

  if (attachmentType === "url") {
    if (!fileUrl || fileUrl.trim() === "") {
      throw new ApiError(400, "URL is required");
    }

    const attachment = await TaskAttachmentModel.create({
      task: task._id,
      attachmentType: "url",
      fileUrl: fileUrl.trim(),
      fileName: fileName || "External Link",
      uploadedBy: userId,
    });

    await createTaskActivityLog({
      taskId: task._id,
      action: "ATTACHMENT_ADDED",
      performedBy: userId,
      meta: {
        type: "url",
        url: fileUrl.trim(),
      },
    });

    const populatedResult = await TaskAttachmentModel.findById(
      attachment._id
    )
      .populate("task", "title status")
      .populate("uploadedBy", "name email");

    return res.status(201).json(
      new ApiResponse(201, "URL attached successfully", {
        attachment: populatedResult,
      })
    );
  }

  throw new ApiError(400, "Invalid attachment type");
});


const getTaskAttachments = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = req.task;

  if (!taskId || !task) {
    throw new ApiError(404, "Task not found");
  }

  const attachments = await TaskAttachmentModel.find({ task: taskId })
    .sort({ createdAt: -1 }) // latest first
    .populate({
      path: "uploadedBy",
      select: "name email avatar",
    });

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Task attachments fetched successfully", attachments)
    );
});

const deleteTaskAttachment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { attachmentId } = req.params;
  const projectId=req.params.projectId

  if (!attachmentId) {
    throw new ApiError(404, "AttachmentId not found");
  }

  const attachment = await TaskAttachmentModel.findById(attachmentId);

  if (!attachment) {
    throw new ApiError(404, "Attachment not found");
  }

  // for activity log we keep data before delete
  const taskId = attachment.task;
  const type = attachment.AttachmentType;
  const fileName = attachment.fileName;
  const fileUrl = attachment.fileUrl;

  // how to find public id fix it
  if (type === "file" && attachment.publicId) {
    await cloudinary.uploader.destroy(attachment.publicId, {
      resource_type: "auto",
    });
  }

  await TaskAttachmentModel.findByIdAndDelete(attachment._id);

  await createTaskActivityLog({
    taskId,
    projectId:projectId,
    action: "ATTACHMENT_DELETED",
    performedBy: userId,
    meta: {
      type,
      fileName,
      fileUrl,
    },
  });

  try {
  const io = getIO();

  io.to(`project:${taskId}`).emit("ATTACHMENT_DELETED", {
    taskId,
    attachmentId: attachment._id,
    attachmentType: type,
    fileName,
  });
} catch (error) {
  console.error("Socket emit failed (ATTACHMENT_DELETED)", error.message);
}

  return res
    .status(200)
    .json(new ApiResponse(200, "Attachment deleted successfully"));
});

export { addTaskAttachment, getTaskAttachments, deleteTaskAttachment };
