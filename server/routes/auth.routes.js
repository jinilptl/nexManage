import express from "express";
import {
  allUsers,
  changePassword,
  forgotPassword,
  loginUser,
  inviteUser,
  setPassword,
  resetPassword,
  logoutUser,
  getMyProfile,
} from "../controllers/user.controllers.js";
import { verifyToken } from "../middlewares/authMiddlewares/varifyToken.middlewares.js";
import { roleChecker } from "../middlewares/authMiddlewares/roleChecker.middlewares.js";

const authRouter = express.Router();

authRouter
  .route("/register")
  .post(verifyToken, roleChecker(["super_admin"]), inviteUser);

authRouter.route("/login").post(loginUser);

authRouter.route("/getmyprofile").get(verifyToken, getMyProfile);

authRouter.route("/logout").post(verifyToken, logoutUser);

authRouter
  .route("/alluser")
  .get(verifyToken, roleChecker(["super_admin"]), allUsers);

authRouter.route("/change-password").post(verifyToken, changePassword);
authRouter.route("/forget-password").post(forgotPassword);
authRouter.route("/reset-password/:token").post(resetPassword);

authRouter.route("/set-password/:token").post(setPassword);

export default authRouter;
