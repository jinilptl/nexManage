import express from "express";
import { verifyToken } from "../middlewares/authMiddlewares/varifyToken.middlewares.js";
import { roleChecker } from "../middlewares/authMiddlewares/roleChecker.middlewares.js";
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
  .post(verifyToken, updateProjectStatus);

projectRouter
  .route("/:projectId/status")
  .post(verifyToken, addProjectTaskStatus);

projectRouter
  .route("/update-project-manager/:projectId")
  .post(verifyToken, updateProjectManager);

// members routes

projectRouter
  .route("/add-members/:projectId")
  .post(verifyToken, addProjectMember);

projectRouter
  .route("/update-members/:projectId/:memberId")
  .post(verifyToken, updateProjectMember);

projectRouter
  .route("/all-members/:projectId")
  .get(verifyToken, getAllProjectMembers);

projectRouter
  .route("/active-members/:projectId/:memberId")
  .patch(verifyToken, activateProjectMember);

projectRouter
  .route("/remove-members/:projectId/:memberId")
  .delete(verifyToken, removeProjectMember);

projectRouter
  .route("/sync-members/:projectId")
  .patch(verifyToken, syncProjectMembers);

export default projectRouter;
