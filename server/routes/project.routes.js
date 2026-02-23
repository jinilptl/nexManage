import express from "express";
import { verifyToken } from "../middlewares/authMiddlewares/varifyToken.middlewares.js";
import { roleChecker } from "../middlewares/authMiddlewares/roleChecker.middlewares.js";
import { canChangeProjectStatus } from "../middlewares/authMiddlewares/canChangeProjectStatus.middlewares.js";
import { isProjectMember } from "../middlewares/taskMiddlewares/isProjectMember.middlewares.js";
import { isNotObserver } from "../middlewares/taskMiddlewares/isNotObserver.middlewares.js";
import {
  addProjectTaskStatus,
  createProject,
  deleteProject,
  getAllProjects,
  getSingleProject,
  getUserProjects,
  updateProject,
  updateProjectManager,
  updateProjectStatus,
  deleteProjectTaskStatus,
} from "../controllers/projectControllers/project.controllers.js";
import {
  activateProjectMember,
  addProjectMember,
  getAllProjectMembers,
  removeProjectMember,
  syncProjectMembers,
  updateProjectMember,
} from "../controllers/projectControllers/projectMembers.controllers.js";

const projectRouter = express.Router();

projectRouter.route("/create-project").post(verifyToken, createProject);

projectRouter.route("/get-all-projects").get(verifyToken, getAllProjects);

projectRouter
  .route("/get-project/:projectId")
  .get(verifyToken, getSingleProject);

projectRouter.route("/get-my-projects").get(verifyToken, getUserProjects);
projectRouter
  .route("/update-project/:projectId")
  .post(verifyToken, updateProject);

projectRouter
  .route("/delete-project/:projectId")
  .delete(verifyToken, deleteProject);

projectRouter
  .route("/update-project-status/:projectId")
  .post(verifyToken, canChangeProjectStatus, updateProjectStatus);

projectRouter
  .route("/:projectId/status")
  .patch(verifyToken, canChangeProjectStatus, updateProjectStatus);

projectRouter
  .route("/:projectId/status")
  .post(verifyToken, isProjectMember, isNotObserver, addProjectTaskStatus);

projectRouter
  .route("/:projectId/status/:statusId")
  .delete(verifyToken, isProjectMember, isNotObserver, deleteProjectTaskStatus);

projectRouter
  .route("/update-project-manager/:projectId")
  .post(verifyToken, updateProjectManager);

// members routes

projectRouter
  .route("/add-members/:projectId")
  .post(verifyToken, isProjectMember, isNotObserver, addProjectMember);

projectRouter
  .route("/update-members/:projectId/:memberId")
  .post(verifyToken, isProjectMember, isNotObserver, updateProjectMember);

projectRouter
  .route("/all-members/:projectId")
  .get(verifyToken, getAllProjectMembers);

projectRouter
  .route("/active-members/:projectId/:memberId")
  .patch(verifyToken, isProjectMember, isNotObserver, activateProjectMember);

projectRouter
  .route("/remove-members/:projectId/:memberId")
  .delete(verifyToken, isProjectMember, isNotObserver, removeProjectMember);

projectRouter
  .route("/sync-members/:projectId")
  .patch(verifyToken, isProjectMember, isNotObserver, syncProjectMembers);

export default projectRouter;
