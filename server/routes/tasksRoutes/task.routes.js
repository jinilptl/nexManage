import express from 'express';
import {verifyToken} from "../../middlewares/authMiddlewares/varifyToken.middlewares.js";
import {roleChecker} from "../../middlewares/authMiddlewares/roleChecker.middlewares.js";

const taskRouter=express.Router()




export default taskRouter;