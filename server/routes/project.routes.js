import express from "express"
import {verifyToken} from "../middlewares/authMiddlewares/varifyToken.middlewares.js"
import {roleChecker} from "../middlewares/authMiddlewares/roleChecker.middlewares.js"
import { createProject, getAllProjects, getSingleProject } from "../controllers/projectControllers/project.controllers.js";

const projectRouter= express.Router();

projectRouter.route("/create-project").post(verifyToken,createProject)

projectRouter.route("/get-all-projects").get(verifyToken,getAllProjects)

projectRouter.route("/get-project/:projectId").get(verifyToken,getSingleProject)




export default projectRouter