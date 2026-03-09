import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../../app.js";
import {
    createTestUser,
    createTestTeam,
    createTestProject,
    authHeader,
    generateObjectId,
} from "../helpers.js";
import { Project } from "../../models/project.models.js";

vi.mock("../../utils/sendMail.js", () => ({
    default: vi.fn().mockResolvedValue(true),
}));

describe("Project API - POST /api/v1/project/create-project", () => {
    it("should create a team project", async () => {
        const { token, user } = await createTestUser({ email: "projcreate@test.com" });
        const team = await createTestTeam(user._id, {
            teamName: "ProjTeam",
            members: [{ user: user._id, roleInTeam: "developer", status: "active" }],
        });

        const res = await request(app)
            .post("/api/v1/project/create-project")
            .set("Authorization", authHeader(token))
            .send({
                projectName: "New Project",
                description: "Test project",
                projectType: "team",
                teams: [team._id],
            });

        expect(res.status).toBe(201);
        expect(res.body.data.projectName).toBe("New Project");
        expect(res.body.data.projectType).toBe("team");
        expect(res.body.data.taskStatuses).toHaveLength(4);
        expect(res.body.data.projectMembers.length).toBeGreaterThanOrEqual(1);
    });

    it("should create a personal project", async () => {
        const { token } = await createTestUser({ email: "personal@test.com" });

        const res = await request(app)
            .post("/api/v1/project/create-project")
            .set("Authorization", authHeader(token))
            .send({
                projectName: "My Personal",
                projectType: "personal",
            });

        expect(res.status).toBe(201);
        expect(res.body.data.projectType).toBe("personal");
    });

    it("should reject team project without teams", async () => {
        const { token } = await createTestUser({ email: "noteams@test.com" });

        const res = await request(app)
            .post("/api/v1/project/create-project")
            .set("Authorization", authHeader(token))
            .send({
                projectName: "NoTeams",
                projectType: "team",
            });

        expect(res.status).toBe(400);
    });

    it("should reject personal project with teams", async () => {
        const { token, user } = await createTestUser({ email: "perteams@test.com" });
        const team = await createTestTeam(user._id, { teamName: "Forbidden" });

        const res = await request(app)
            .post("/api/v1/project/create-project")
            .set("Authorization", authHeader(token))
            .send({
                projectName: "PersonalWithTeam",
                projectType: "personal",
                teams: [team._id],
            });

        expect(res.status).toBe(400);
    });

    it("should reject without project name", async () => {
        const { token } = await createTestUser({ email: "noname@test.com" });

        const res = await request(app)
            .post("/api/v1/project/create-project")
            .set("Authorization", authHeader(token))
            .send({ projectType: "personal" });

        expect(res.status).toBe(400);
    });

    it("should reject invalid project type", async () => {
        const { token } = await createTestUser({ email: "badtype@test.com" });

        const res = await request(app)
            .post("/api/v1/project/create-project")
            .set("Authorization", authHeader(token))
            .send({ projectName: "BadType", projectType: "invalid" });

        expect(res.status).toBe(400);
    });
});

describe("Project API - GET Endpoints", () => {
    it("should get all projects", async () => {
        const { token, user } = await createTestUser({ email: "getall@test.com" });
        await createTestProject(user._id, { projectName: "P1" });
        await createTestProject(user._id, { projectName: "P2" });

        const res = await request(app)
            .get("/api/v1/project/get-all-projects")
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it("should get user's projects", async () => {
        const { token, user } = await createTestUser({ email: "myprojs@test.com" });
        await createTestProject(user._id, { projectName: "MyProj" });

        const res = await request(app)
            .get("/api/v1/project/get-my-projects")
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it("should get single project by ID", async () => {
        const { token, user } = await createTestUser({ email: "single@test.com" });
        const project = await createTestProject(user._id, { projectName: "Solo" });

        const res = await request(app)
            .get(`/api/v1/project/get-project/${project._id}`)
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);
        expect(res.body.data.projectName).toBe("Solo");
    });

    it("should return 404 for non-existent project", async () => {
        const { token } = await createTestUser({ email: "no@test.com" });

        const res = await request(app)
            .get(`/api/v1/project/get-project/${generateObjectId()}`)
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(404);
    });

    it("should filter projects by status", async () => {
        const { token, user } = await createTestUser({ email: "filtproj@test.com" });
        await createTestProject(user._id, { projectName: "Active", status: "ACTIVE" });
        await createTestProject(user._id, {
            projectName: "OnHold",
            status: "ON_HOLD",
        });

        const res = await request(app)
            .get("/api/v1/project/get-all-projects?status=ON_HOLD")
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);
        const names = res.body.data.map((p) => p.projectName);
        expect(names).toContain("OnHold");
        expect(names).not.toContain("Active");
    });
});

describe("Project API - Update & Delete", () => {
    it("should update project details", async () => {
        const { token, user } = await createTestUser({ email: "updproj@test.com" });

        const team = await createTestTeam(user._id, { teamName: "UpdTeam" });

        const project = await createTestProject(user._id, {
            projectName: "OldProject",
            teams: [team._id],
        });

        const res = await request(app)
            .post(`/api/v1/project/update-project/${project._id}`)
            .set("Authorization", authHeader(token))
            .send({
                projectName: "UpdatedProject",
                description: "Updated desc",
                teams: [team._id],
            });

        expect(res.status).toBe(200);
        expect(res.body.data.projectName).toBe("UpdatedProject");
    });

    it("should delete a project", async () => {
        const { token, user } = await createTestUser({ email: "delproj@test.com" });
        const project = await createTestProject(user._id, { projectName: "DelMe" });

        const res = await request(app)
            .delete(`/api/v1/project/delete-project/${project._id}`)
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);

        const deleted = await Project.findById(project._id);
        expect(deleted).toBeNull();
    });
});

describe("Project Status API", () => {
    it("should update project status", async () => {
        const { token, user } = await createTestUser({
            role: "super_admin",
            email: "projstatus@test.com",
        });
        const project = await createTestProject(user._id, { projectName: "StatusProj" });

        const res = await request(app)
            .patch(`/api/v1/project/${project._id}/status`)
            .set("Authorization", authHeader(token))
            .send({ status: "ON_HOLD" });

        expect(res.status).toBe(200);
        expect(res.body.data.status).toBe("ON_HOLD");
    });

    it("should reject invalid project status", async () => {
        const { token, user } = await createTestUser({
            role: "super_admin",
            email: "badprojst@test.com",
        });
        const project = await createTestProject(user._id, {
            projectName: "BadSt",
        });

        const res = await request(app)
            .patch(`/api/v1/project/${project._id}/status`)
            .set("Authorization", authHeader(token))
            .send({ status: "INVALID" });

        expect(res.status).toBe(400);
    });
});

describe("Project Task Statuses API", () => {
    it("should add a custom task status to a project", async () => {
        const { token, user } = await createTestUser({
            role: "super_admin",
            email: "addstatus@test.com",
        });
        const project = await createTestProject(user._id, {
            projectName: "StatusProj2",
        });

        const res = await request(app)
            .post(`/api/v1/project/${project._id}/status`)
            .set("Authorization", authHeader(token))
            .send({ key: "testing", label: "Testing" });

        expect(res.status).toBe(201);
        expect(res.body.data.key).toBe("testing");
        expect(res.body.data.label).toBe("Testing");
    });

    it("should reject duplicate status key", async () => {
        const { token, user } = await createTestUser({
            role: "super_admin",
            email: "dupstatus@test.com",
        });
        const project = await createTestProject(user._id, {
            projectName: "DupSt",
        });

        const res = await request(app)
            .post(`/api/v1/project/${project._id}/status`)
            .set("Authorization", authHeader(token))
            .send({ key: "todo", label: "Duplicate To Do" });

        expect(res.status).toBe(400);
    });

    it("should delete a non-default custom task status", async () => {
        const { token, user } = await createTestUser({
            role: "super_admin",
            email: "delstatus@test.com",
        });
        const project = await createTestProject(user._id, {
            projectName: "DelSt",
        });

        await request(app)
            .post(`/api/v1/project/${project._id}/status`)
            .set("Authorization", authHeader(token))
            .send({ key: "custom_status", label: "Custom Status" });

        const updatedProject = await Project.findById(project._id);
        const customStatus = updatedProject.taskStatuses.find(
            (s) => s.key === "custom_status",
        );

        const res = await request(app)
            .delete(`/api/v1/project/${project._id}/status/${customStatus._id}`)
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);
    });

    it("should reject deleting a default task status", async () => {
        const { token, user } = await createTestUser({
            role: "super_admin",
            email: "defstatus@test.com",
        });
        const project = await createTestProject(user._id, {
            projectName: "DefSt",
        });

        const defaultStatus = project.taskStatuses.find((s) => s.isDefault);

        const res = await request(app)
            .delete(`/api/v1/project/${project._id}/status/${defaultStatus._id}`)
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(400);
    });
});

describe("Project Members API", () => {
    it("should add a member to a project", async () => {
        const { token, user } = await createTestUser({
            role: "super_admin",
            email: "addmem@test.com",
        });
        const { user: newMember } = await createTestUser({
            email: "projmem@test.com",
        });
        const project = await createTestProject(user._id, {
            projectName: "AddMemProj",
        });

        const res = await request(app)
            .post(`/api/v1/project/add-members/${project._id}`)
            .set("Authorization", authHeader(token))
            .send({ email: "projmem@test.com", roleInProject: "developer" });

        expect(res.status).toBe(201);
        expect(res.body.data.roleInProject).toBe("developer");
    });

    it("should reject duplicate active member", async () => {
        const { token, user } = await createTestUser({
            role: "super_admin",
            email: "dupmemadd@test.com",
        });
        const { user: existing } = await createTestUser({
            email: "exist@test.com",
        });
        const project = await createTestProject(user._id, {
            projectName: "DupMemProj",
            projectMembers: [
                { user: user._id, roleInProject: "project-manager", status: "active" },
                { user: existing._id, roleInProject: "developer", status: "active" },
            ],
        });

        const res = await request(app)
            .post(`/api/v1/project/add-members/${project._id}`)
            .set("Authorization", authHeader(token))
            .send({ email: "exist@test.com", roleInProject: "tester" });

        expect(res.status).toBe(409);
    });

    it("should get all project members", async () => {
        const { token, user } = await createTestUser({
            email: "getmems@test.com",
        });
        const project = await createTestProject(user._id, { projectName: "GetMems" });

        const res = await request(app)
            .get(`/api/v1/project/all-members/${project._id}`)
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it("should remove a project member (soft delete)", async () => {
        const { token, user } = await createTestUser({
            role: "super_admin",
            email: "rmmem@test.com",
        });
        const { user: member } = await createTestUser({
            email: "rmable@test.com",
        });
        const project = await createTestProject(user._id, {
            projectName: "RmMemProj",
            projectMembers: [
                { user: user._id, roleInProject: "project-manager", status: "active" },
                { user: member._id, roleInProject: "developer", status: "active" },
            ],
        });

        const res = await request(app)
            .delete(`/api/v1/project/remove-members/${project._id}/${member._id}`)
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);
        expect(res.body.data.status).toBe("removed");
    });

    it("should prevent removing project manager", async () => {
        const { token, user } = await createTestUser({
            role: "super_admin",
            email: "rmpma@test.com",
        });
        const project = await createTestProject(user._id, {
            projectName: "RmPMProj",
        });

        const res = await request(app)
            .delete(`/api/v1/project/remove-members/${project._id}/${user._id}`)
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(400);
    });
});
