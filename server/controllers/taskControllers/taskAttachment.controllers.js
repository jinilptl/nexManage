import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { createTaskActivityLog } from "../../utils/CreateActivityLog.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { Task as TaskModel } from "../../models/Task models/task.models.js";
import { TaskAttachment as TaskAttachmentModel } from "../../models/Task models/taskAttachment.models.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { getIO } from "../../socket/index.js";
import { v2 as cloudinary } from "cloudinary";

const addTaskAttachment = asyncHandler(async (req, res) => {
  const { taskId, projectId } = req.params;
  const userId = req.user._id;

  const { attachmentType, fileUrl, fileName } = req.body;

  if (attachmentType === "file") {
    if (!req.file) {
      throw new ApiError(400, "File is required");
    }

    const uploadResult = await uploadOnCloudinary(
      req.file.path,
      `nexmanage/tasks/${taskId}/attachments`,
    );
    if (!uploadResult) {
      throw new ApiError(500, "File upload failed");
    }

    const attachment = await TaskAttachmentModel.create({
      task: taskId,
      attachmentType: "file",
      fileUrl: uploadResult.url,
      fileName: uploadResult.fileName,
      publicId: uploadResult.publicId,
      uploadedBy: userId,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "File attached successfully", attachment));
  }

  if (attachmentType === "url") {
    if (!fileUrl) {
      throw new ApiError(400, "URL is required");
    }

    const attachment = await TaskAttachmentModel.create({
      task: taskId,
      attachmentType: "url",
      fileUrl,
      fileName: fileName || "External Link",
      uploadedBy: userId,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "URL attached successfully", attachment));
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
    .sort({ createdAt: -1 })
    .populate({
      path: "uploadedBy",
      select: "name email avatar",
    });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Task attachments fetched successfully",
        attachments,
      ),
    );
});

const deleteTaskAttachment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { attachmentId } = req.params;
  const projectId = req.params.projectId;

  if (!attachmentId) {
    throw new ApiError(404, "AttachmentId not found");
  }

  const attachment = await TaskAttachmentModel.findById(attachmentId);

  if (!attachment) {
    throw new ApiError(404, "Attachment not found");
  }

  const taskId = attachment.task;
  const type = attachment.attachmentType;
  const fileName = attachment.fileName;
  const fileUrl = attachment.fileUrl;

  if (type === "file" && attachment.publicId) {
    try {
      const resourceType = req.query.resource_type || "raw";

      const validResourceType = resourceType === "auto" ? "raw" : resourceType;

      await cloudinary.uploader.destroy(attachment.publicId, {
        resource_type: validResourceType,
      });
    } catch (error) {
      console.error(
        "Cloudinary destroy failed (non-fatal):",
        error.message || error,
      );
    }
  }

  await TaskAttachmentModel.findByIdAndDelete(attachment._id);

  await createTaskActivityLog({
    taskId,
    projectId: projectId,
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

    io.to(`project:${projectId}`).emit("ATTACHMENT_DELETED", {
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