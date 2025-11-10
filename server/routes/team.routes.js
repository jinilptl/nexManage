import express from "express";
import { createTeam,getAllTeams, getSingleTeam } from "../controllers/team.controllers.js";
import {verifyToken} from "../middlewares/authMiddlewares/varifyToken.middlewares.js"
import { roleChecker } from "../middlewares/authMiddlewares/roleChecker.middlewares.js";



const teamRouter=express.Router();


// Create new team
teamRouter.route("/create").post(verifyToken,roleChecker(["super_admin","admin"]),createTeam)

// get all teh teams
teamRouter.route("/allteams").get(verifyToken,roleChecker(["super_admin","admin"]),getAllTeams)

//get team by teamid
teamRouter.route("/getteams/:id").get(verifyToken,getSingleTeam)


// pending routes
teamRouter.route("/updateteam/:id")
teamRouter.route("/deleteteam/:id")

// pendig for member add in team 
teamRouter.route("/addmember")
teamRouter.route("/updatemember")
teamRouter.route("/removemember")
teamRouter.route("/allmember")






export default teamRouter