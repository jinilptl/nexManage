import express from "express";
import { getDashboardAnalytics } from "../controllers/analytics.controllers.js";
import { verifyToken } from "../middlewares/authMiddlewares/varifyToken.middlewares.js";
import { getDashboardData } from "../controllers/dashboard.controller.js";


const router = express.Router();

router.get("/dashboard", verifyToken, getDashboardAnalytics);
router.get("/main-dashboard", verifyToken, getDashboardData);

export default router;