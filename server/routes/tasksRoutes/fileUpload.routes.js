import express from "express";
import { verifyToken } from "../../middlewares/authMiddlewares/varifyToken.middlewares.js";
import { roleChecker } from "../../middlewares/authMiddlewares/roleChecker.middlewares.js";

import { isProjectMember } from "../../middlewares/taskMiddlewares/isProjectMember.middlewares.js";
import { isProjectManager } from "../../middlewares/taskMiddlewares/isProjectManager.middlewares.js";
import { attachTaskToRequest } from "../../middlewares/taskMiddlewares/attachTaskToRequest.middlewares.js";
import { isAssigneeOrProjectManager } from "../../middlewares/taskMiddlewares/isAssigneeOrProjectManager.middlewares.js";
import { upload } from "../../middlewares/fileUploadMiddlewares/multer.middleware.js";
import {
  addTaskAttachment,
  deleteTaskAttachment,
  getTaskAttachments,
} from "../../controllers/taskControllers/taskAttachment.controllers.js";

const fileUploadRouter = express.Router();

fileUploadRouter.route("/attachments/:projectId/:taskId").post(
  verifyToken,
  attachTaskToRequest,
  isProjectMember,
  isAssigneeOrProjectManager,
  upload.single("file"), // only for uploading file
  addTaskAttachment,
);

fileUploadRouter
  .route("/attachments/:projectId/:taskId")
  .get(verifyToken, attachTaskToRequest, isProjectMember, getTaskAttachments);

fileUploadRouter
  .route("/attachments/:projectId/:taskId/:attachmentId")
  .delete(
    verifyToken,
    attachTaskToRequest,
    isProjectMember,
    deleteTaskAttachment,
  );

export default fileUploadRouter;
