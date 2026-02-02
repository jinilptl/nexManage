import express from "express";
import { getDashboardAnalytics } from "../controllers/analytics.controllers.js";
import { verifyToken } from "../middlewares/authMiddlewares/varifyToken.middlewares.js";

const router = express.Router();

router.get("/dashboard", verifyToken, getDashboardAnalytics);

export default router;