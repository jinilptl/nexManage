import express from "express";
import { createNewTeam,
  getAllTeams,
  getTeamById,
  updateTeamDetails,
  deleteTeamById,
  addTeamMember,
  getTeamMembers, } from "../controllers/team.controllers.js";
import {verifyToken} from "../middlewares/authMiddlewares/varifyToken.middlewares.js"
import { roleChecker } from "../middlewares/authMiddlewares/roleChecker.middlewares.js";



const teamRouter=express.Router();


// Create new team
teamRouter.route("/create").post(verifyToken,roleChecker(["super_admin","admin"]),createNewTeam)

// get all teh teams
teamRouter.route("/allteams").get(verifyToken,roleChecker(["super_admin","admin"]),getAllTeams)

//get team by teamid
teamRouter.route("/getteams/:id").get(verifyToken,getTeamById)

//update and delete team
teamRouter.route("/updateteam/:id").post(verifyToken,updateTeamDetails)

teamRouter.route("/deleteteam/:id").post(verifyToken,deleteTeamById)

//  member add in team 
teamRouter.route("/:teamId/addmembers").post(verifyToken,addTeamMember)
teamRouter.route("/:teamId/allmember").get(verifyToken,getTeamMembers)

// pending routes
teamRouter.route("/:teamId/updatemember")
teamRouter.route("/:teamId/removemember")






export default teamRouter