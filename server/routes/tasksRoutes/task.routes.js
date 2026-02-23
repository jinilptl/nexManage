import express from "express";
import { verifyToken } from "../../middlewares/authMiddlewares/varifyToken.middlewares.js";
import { roleChecker } from "../../middlewares/authMiddlewares/roleChecker.middlewares.js";

import { isProjectMember } from "../../middlewares/taskMiddlewares/isProjectMember.middlewares.js";
import { isProjectManager } from "../../middlewares/taskMiddlewares/isProjectManager.middlewares.js";
import { attachTaskToRequest } from "../../middlewares/taskMiddlewares/attachTaskToRequest.middlewares.js";
import { isAssigneeOrProjectManager } from "../../middlewares/taskMiddlewares/isAssigneeOrProjectManager.middlewares.js";
import { isNotObserver } from "../../middlewares/taskMiddlewares/isNotObserver.middlewares.js";
import {
  createTask,
  deleteTask,
  getProjectTasks,
  getTaskDetails,
  updateTask,
  updateTaskAssignees,
  updateTaskOrder,
  updateTaskStatus,
} from "../../controllers/taskControllers/task.controllers.js";

const taskRouter = express.Router();

// task routes

// Create Task
taskRouter
  .route("/create-task/:projectId")
  .post(
    verifyToken,
    roleChecker(["admin", "member", "super_admin"]),
    isProjectMember,
    isNotObserver,
    isProjectManager,
    createTask,
  );

//get all tasks for a project
taskRouter
  .route("/project-tasks/:projectId")
  .get(
    verifyToken,
    roleChecker(["admin", "member", "super_admin"]),
    isProjectMember,
    getProjectTasks,
  );

//get single task details

taskRouter
  .route("/:projectId/get-task/:taskId")
  .get(
    verifyToken,
    roleChecker(["admin", "member", "super_admin"]),
    attachTaskToRequest,
    isProjectMember,
    getTaskDetails,
  );

//update task

taskRouter
  .route("/update-task/:projectId/:taskId")
  .put(
    verifyToken,
    roleChecker(["admin", "member", "super_admin"]),
    attachTaskToRequest,
    isProjectMember,
    isNotObserver,
    isAssigneeOrProjectManager,
    updateTask,
  );

taskRouter
  .route("/status/:projectId/:taskId")
  .patch(
    verifyToken,
    roleChecker(["admin", "member", "super_admin"]),
    attachTaskToRequest,
    isProjectMember,
    isNotObserver,
    isAssigneeOrProjectManager,
    updateTaskStatus,
  );

taskRouter
  .route("/order/:projectId/:taskId")
  .patch(
    verifyToken,
    roleChecker(["admin", "member", "super_admin"]),
    attachTaskToRequest,
    isProjectMember,
    isNotObserver,
    isAssigneeOrProjectManager,
    updateTaskOrder,
  );

taskRouter
  .route("/delete/:projectId/:taskId")
  .delete(
    verifyToken,
    attachTaskToRequest,
    isProjectMember,
    isNotObserver,
    isProjectManager,
    deleteTask,
  );

taskRouter
  .route("/updatetask-assignees/:projectId/:taskId")
  .patch(
    verifyToken,
    attachTaskToRequest,
    isProjectMember,
    isNotObserver,
    isProjectManager,
    updateTaskAssignees,
  );

export default taskRouter;
