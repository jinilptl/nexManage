import express from "express";
import {
  createNewTeam,
  getAllTeams,
  getTeamById,
  updateTeamDetails,
  updateTeamStatus,
  deleteTeamById,
  addTeamMember,
  getTeamMembers,
  updateTeamMember,
  removeTeamMember,
  getUsersAllTeams,
} from "../controllers/team.controllers.js";
import { verifyToken } from "../middlewares/authMiddlewares/varifyToken.middlewares.js";
import { roleChecker } from "../middlewares/authMiddlewares/roleChecker.middlewares.js";
import { canChangeTeamStatus } from "../middlewares/authMiddlewares/canChangeTeamStatus.middlewares.js";

const teamRouter = express.Router();

teamRouter
  .route("/create-team")
  .post(verifyToken, roleChecker(["super_admin", "admin"]), createNewTeam);

// Get all teams
teamRouter
  .route("/get-all-teams")
  .get(verifyToken, roleChecker(["super_admin", "admin"]), getAllTeams);

// Get a single team by ID
teamRouter.route("/get-team/:teamId").get(verifyToken, getTeamById);

// Update team details
teamRouter.route("/update-team/:teamId").post(verifyToken, updateTeamDetails);

// Update team status (e.g. archive)
teamRouter
  .route("/:teamId/status")
  .patch(verifyToken, canChangeTeamStatus, updateTeamStatus);

// Delete a team
teamRouter.route("/delete-team/:teamId").post(verifyToken, deleteTeamById);

// Get all teams of a user
teamRouter.route("/user-teams").get(verifyToken, getUsersAllTeams);

// Add a new member to a team
teamRouter.route("/add-member/:teamId").post(verifyToken, addTeamMember);

// Get all members in a team
teamRouter.route("/get-all-members/:teamId").get(verifyToken, getTeamMembers);

// Update a specific team member
teamRouter
  .route("/update-member/:teamId/:memberId")
  .post(verifyToken, updateTeamMember);

// Remove a specific team member
teamRouter
  .route("/remove-member/:teamId/:memberId")
  .post(verifyToken, removeTeamMember);

export default teamRouter;
