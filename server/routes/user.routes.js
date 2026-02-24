import express from "express";
import {
  inviteUser,
  loginUser,
  allUsers,
  changePassword,
  forgotPassword,
  resetPassword,
  logoutUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controllers.js";

import { verifyToken } from "../middlewares/authMiddlewares/varifyToken.middlewares.js";
import { roleChecker } from "../middlewares/authMiddlewares/roleChecker.middlewares.js";

const router = express.Router();

// Auth
router.post("/register", verifyToken, roleChecker(["super_admin"]), inviteUser);
router.post("/login", loginUser);
router.post("/logout", verifyToken, logoutUser);

// Password
router.post("/change-password", verifyToken, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get(
  "/all-users",
  verifyToken,
  roleChecker(["admin", "super_admin"]),
  allUsers,
);
router.put("/update-user/:userId", verifyToken, updateUser);
router.delete(
  "/delete-user/:userId",
  verifyToken,
  roleChecker(["admin", "super_admin"]),
  deleteUser,
);

export default router;
