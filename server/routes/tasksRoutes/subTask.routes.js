import express from "express";
import { verifyToken } from "../../middlewares/authMiddlewares/varifyToken.middlewares.js";
import { roleChecker } from "../../middlewares/authMiddlewares/roleChecker.middlewares.js";

import { isProjectMember } from "../../middlewares/taskMiddlewares/isProjectMember.middlewares.js";
import { isProjectManager } from "../../middlewares/taskMiddlewares/isProjectManager.middlewares.js";
import { attachTaskToRequest } from "../../middlewares/taskMiddlewares/attachTaskToRequest.middlewares.js";
import { isAssigneeOrProjectManager } from "../../middlewares/taskMiddlewares/isAssigneeOrProjectManager.middlewares.js";

const subTaskRouter = express.Router();


subTaskRouter
.route("/create-subtask/:taskId")
.post(
  verifyToken,
  roleChecker(["admin", "member", "super_admin"]),
  attachTaskToRequest,
  isProjectMember,
  isAssigneeOrProjectManager,
//   addSubTask 
)



export default subTaskRouter;