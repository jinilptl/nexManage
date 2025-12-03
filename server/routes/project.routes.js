import express from "express";
import { verifyToken } from "../middlewares/authMiddlewares/varifyToken.middlewares.js";
import { roleChecker } from "../middlewares/authMiddlewares/roleChecker.middlewares.js";
import {
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

projectRouter
  .route("/get-my-projects")
  .get(verifyToken, getUserProjects);
projectRouter
  .route("/update-project/:projectId")
  .post(verifyToken, updateProject);


  // this is are not checked by postman right now ..

  projectRouter.route("/delete-project/:projectId").delete(verifyToken,deleteProject)

  projectRouter.route("/update-project-status/:projectId").post(verifyToken,updateProjectStatus)

  projectRouter.route("/update-project-manager/:projectId").post(verifyToken,updateProjectManager)

// members routes

projectRouter
  .route("/projects/:projectId/add-members")
  .post(verifyToken, addProjectMember); 

projectRouter
  .route("/projects/:projectId/all-members")
  .get(verifyToken, getAllProjectMembers);

projectRouter
  .route("/projects/:projectId/update-members/:memberId")
  .patch(verifyToken, updateProjectMember);

projectRouter
  .route("/projects/:projectId/remove-members/:memberId")
  .delete(verifyToken, removeProjectMember);

projectRouter
  .route("/projects/:projectId/sync-members")
  .patch(verifyToken, syncProjectMembers);

export default projectRouter;
