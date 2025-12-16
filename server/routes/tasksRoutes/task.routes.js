import express from 'express';
import {verifyToken} from "../../middlewares/authMiddlewares/varifyToken.middlewares.js";
import {roleChecker} from "../../middlewares/authMiddlewares/roleChecker.middlewares.js";

import { isProjectMember } from '../../middlewares/taskMiddlewares/isProjectMember.middlewares.js';
import {isProjectManager} from "../../middlewares/taskMiddlewares/isProjectManager.middlewares.js"
import { createTask } from '../../controllers/taskControllers/task.controllers.js';

const taskRouter=express.Router()

taskRouter.route('/create-task/:projectId').post(verifyToken,roleChecker(['admin','member','super_admin']),isProjectMember,isProjectManager,createTask)




export default taskRouter;