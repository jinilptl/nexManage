import express from "express";
import { verifyToken } from "../../middlewares/authMiddlewares/varifyToken.middlewares.js";
import { roleChecker } from "../../middlewares/authMiddlewares/roleChecker.middlewares.js";

import { isProjectMember } from "../../middlewares/taskMiddlewares/isProjectMember.middlewares.js";
import { isProjectManager } from "../../middlewares/taskMiddlewares/isProjectManager.middlewares.js";
import { attachTaskToRequest } from "../../middlewares/taskMiddlewares/attachTaskToRequest.middlewares.js";
import { isAssigneeOrProjectManager } from "../../middlewares/taskMiddlewares/isAssigneeOrProjectManager.middlewares.js";
import { attachSubTaskToRequest } from "../../middlewares/taskMiddlewares/subTaskMiddlewares/attechSubTaskToRequest.middlewares.js";
import { addSubTask, deleteSubTask, toggleSubTaskCompletion, updateSubTask } from "../../controllers/taskControllers/subTask.controllers.js";

const subTaskRouter = express.Router();


subTaskRouter
.route("/create-subtask/:taskId")
.post(
  verifyToken,
  roleChecker(["admin", "member", "super_admin"]),
  attachTaskToRequest,
  isProjectMember,
  isAssigneeOrProjectManager,
  addSubTask
)

subTaskRouter
.route("/update-subtasks/:subTaskId")
.post(
  verifyToken,
  roleChecker(["admin", "member", "super_admin"]),
  attachSubTaskToRequest,
  isProjectMember,
  isAssigneeOrProjectManager,
  updateSubTask
  
)


subTaskRouter
.route("/complete/:subTaskId")
.post(
  verifyToken,
  roleChecker(["admin", "member", "super_admin"]),
  attachSubTaskToRequest,
  isProjectMember,
  isAssigneeOrProjectManager,
  toggleSubTaskCompletion
  
)

subTaskRouter
.route("/delete/:subTaskId")
.post(
  verifyToken,
  roleChecker(["admin", "member", "super_admin"]),
  attachSubTaskToRequest,
  isProjectMember,
  isAssigneeOrProjectManager,
  deleteSubTask
  
)




export default subTaskRouter;