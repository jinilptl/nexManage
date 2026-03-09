import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../../app.js";
import {
    createTestUser,
    createTestProject,
    createTestTask,
    authHeader,
} from "../helpers.js";

vi.mock("../../socket/index.js", () => ({
    getIO: vi.fn(() => ({
        to: vi.fn(() => ({
            emit: vi.fn(),
        })),
    })),
    initSocket: vi.fn(),
}));

vi.mock("../../utils/sendMail.js", () => ({
    default: vi.fn().mockResolvedValue(true),
}));

describe("Analytics API - GET /api/v1/analytics/dashboard", () => {
    it("should return analytics data for a user", async () => {
        const { token, user } = await createTestUser({
            email: "analytics@test.com",
        });
        const project = await createTestProject(user._id, {
            projectName: "AnalyticsProj",
        });
        const todoStatusId = project.taskStatuses.find((s) => s.key === "todo")._id;
        const doneStatusId = project.taskStatuses.find((s) => s.key === "done")._id;

        await createTestTask(project._id, user._id, todoStatusId, {
            title: "Todo Task One",
        });
        await createTestTask(project._id, user._id, doneStatusId, {
            title: "Done Task One",
        });

        const res = await request(app)
            .get("/api/v1/analytics/dashboard")
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.data.totalTasks).toBeGreaterThanOrEqual(2);
        expect(res.body.data.completedTasks).toBeGreaterThanOrEqual(1);
        expect(typeof res.body.data.completionRate).toBe("number");
        expect(Array.isArray(res.body.data.priorityData)).toBe(true);
        expect(Array.isArray(res.body.data.statusData)).toBe(true);
        expect(Array.isArray(res.body.data.activeProjects)).toBe(true);
    });

    it("should reject without authentication", async () => {
        const res = await request(app).get("/api/v1/analytics/dashboard");
        expect(res.status).toBe(401);
    });

    it("should return zeros for user with no projects", async () => {
        const { token } = await createTestUser({
            email: "noprojects@test.com",
        });

        const res = await request(app)
            .get("/api/v1/analytics/dashboard")
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);
        expect(res.body.data.totalTasks).toBe(0);
        expect(res.body.data.completedTasks).toBe(0);
        expect(res.body.data.completionRate).toBe(0);
    });
});

describe("Dashboard API - GET /api/v1/analytics/main-dashboard", () => {
    it("should return dashboard data for admin", async () => {
        const { token, user } = await createTestUser({
            email: "dashboard@test.com",
            role: "admin",
        });
        const project = await createTestProject(user._id, {
            projectName: "DashProj",
        });
        const statusId = project.taskStatuses[0]._id;

        await createTestTask(project._id, user._id, statusId, {
            title: "Dashboard Task",
        });

        const res = await request(app)
            .get("/api/v1/analytics/main-dashboard")
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(typeof res.body.data.totalProjects).toBe("number");
        expect(typeof res.body.data.totalTeams).toBe("number");
        expect(typeof res.body.data.totalTasksCount).toBe("number");
        expect(Array.isArray(res.body.data.recentActivity)).toBe(true);
        expect(Array.isArray(res.body.data.upcomingDeadlines)).toBe(true);
        expect(Array.isArray(res.body.data.projectProgress)).toBe(true);
    });

    it("should return project progress data", async () => {
        const { token, user } = await createTestUser({
            email: "progress@test.com",
            role: "super_admin",
        });
        const project = await createTestProject(user._id, {
            projectName: "ProgressProj",
        });
        const todoId = project.taskStatuses.find((s) => s.key === "todo")._id;
        const doneId = project.taskStatuses.find((s) => s.key === "done")._id;

        await createTestTask(project._id, user._id, todoId, {
            title: "Incomplete Task",
        });
        await createTestTask(project._id, user._id, doneId, {
            title: "Completed Task",
        });

        const res = await request(app)
            .get("/api/v1/analytics/main-dashboard")
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);
        const pp = res.body.data.projectProgress;
        expect(pp.length).toBeGreaterThanOrEqual(1);
        expect(pp[0].stats.totalTasks).toBe(2);
        expect(pp[0].stats.completedTasks).toBe(1);
        expect(pp[0].progress).toBe(50);
    });
});
