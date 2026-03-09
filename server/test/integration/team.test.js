import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { createTestUser, createTestTeam, authHeader, generateObjectId } from "../helpers.js";
import { Team } from "../../models/team.models.js";

vi.mock("../../utils/sendMail.js", () => ({
    default: vi.fn().mockResolvedValue(true),
}));

describe("Team API - POST /api/v1/team/create-team", () => {
    it("should create a team as admin", async () => {
        const { token } = await createTestUser({
            role: "admin",
            email: "teamadmin@test.com",
        });

        const res = await request(app)
            .post("/api/v1/team/create-team")
            .set("Authorization", authHeader(token))
            .send({ teamName: "Alpha Team", description: "First team" });

        expect(res.status).toBe(201);
        expect(res.body.data.teamName).toBe("Alpha Team");
        expect(res.body.data.description).toBe("First team");
    });

    it("should reject team creation for non-admin", async () => {
        const { token } = await createTestUser({
            role: "member",
            email: "noadmin@test.com",
        });

        const res = await request(app)
            .post("/api/v1/team/create-team")
            .set("Authorization", authHeader(token))
            .send({ teamName: "Beta", description: "desc" });

        expect(res.status).toBe(403);
    });

    it("should reject duplicate team name", async () => {
        const { token, user } = await createTestUser({
            role: "admin",
            email: "dup@test.com",
        });

        await createTestTeam(user._id, { teamName: "DupTeam" });

        const res = await request(app)
            .post("/api/v1/team/create-team")
            .set("Authorization", authHeader(token))
            .send({ teamName: "DupTeam", description: "desc" });

        expect(res.status).toBe(400);
    });

    it("should reject without required fields", async () => {
        const { token } = await createTestUser({
            role: "admin",
            email: "noreq@test.com",
        });

        const res = await request(app)
            .post("/api/v1/team/create-team")
            .set("Authorization", authHeader(token))
            .send({ teamName: "NoDesc" });

        expect(res.status).toBe(400);
    });
});

describe("Team API - GET /api/v1/team/get-all-teams", () => {
    it("should fetch all teams for admin", async () => {
        const { token, user } = await createTestUser({
            role: "super_admin",
            email: "allteams@test.com",
        });

        await createTestTeam(user._id, { teamName: "T1" });
        await createTestTeam(user._id, { teamName: "T2" });

        const res = await request(app)
            .get("/api/v1/team/get-all-teams")
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it("should filter teams by status", async () => {
        const { token, user } = await createTestUser({
            role: "admin",
            email: "filter@test.com",
        });

        await createTestTeam(user._id, {
            teamName: "ActiveTeam",
            status: "ACTIVE",
        });
        await createTestTeam(user._id, {
            teamName: "ArchivedTeam",
            status: "ARCHIVED",
            isActive: false,
        });

        const res = await request(app)
            .get("/api/v1/team/get-all-teams?status=ARCHIVED")
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);
        const names = res.body.data.map((t) => t.teamName);
        expect(names).toContain("ArchivedTeam");
        expect(names).not.toContain("ActiveTeam");
    });

    it("should reject invalid status filter", async () => {
        const { token } = await createTestUser({
            role: "admin",
            email: "badstatus@test.com",
        });

        const res = await request(app)
            .get("/api/v1/team/get-all-teams?status=DELETED")
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(400);
    });
});

describe("Team API - GET /api/v1/team/get-team/:teamId", () => {
    it("should fetch team by ID", async () => {
        const { token, user } = await createTestUser({ email: "getteam@test.com" });
        const team = await createTestTeam(user._id, { teamName: "FetchMe" });

        const res = await request(app)
            .get(`/api/v1/team/get-team/${team._id}`)
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);
        expect(res.body.data.teamName).toBe("FetchMe");
    });

    it("should return 404 for non-existent team", async () => {
        const { token } = await createTestUser({ email: "noexist@test.com" });

        const res = await request(app)
            .get(`/api/v1/team/get-team/${generateObjectId()}`)
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(404);
    });
});

describe("Team API - POST /api/v1/team/update-team/:teamId", () => {
    it("should update team details", async () => {
        const { token, user } = await createTestUser({ email: "upteam@test.com" });
        const team = await createTestTeam(user._id, { teamName: "OldName" });

        const res = await request(app)
            .post(`/api/v1/team/update-team/${team._id}`)
            .set("Authorization", authHeader(token))
            .send({ teamName: "NewName", description: "Updated description" });

        expect(res.status).toBe(200);
        expect(res.body.data.teamName).toBe("NewName");
    });
});

describe("Team API - POST /api/v1/team/delete-team/:teamId", () => {
    it("should delete a team", async () => {
        const { token, user } = await createTestUser({ email: "delteam@test.com" });
        const team = await createTestTeam(user._id, { teamName: "DelTeam" });

        const res = await request(app)
            .post(`/api/v1/team/delete-team/${team._id}`)
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);

        const deleted = await Team.findById(team._id);
        expect(deleted).toBeNull();
    });

    it("should return 404 for non-existent team", async () => {
        const { token } = await createTestUser({ email: "del404@test.com" });

        const res = await request(app)
            .post(`/api/v1/team/delete-team/${generateObjectId()}`)
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(404);
    });
});

describe("Team Members API", () => {
    it("should add a member to a team", async () => {
        const { token, user } = await createTestUser({ email: "owner@test.com" });
        const { user: member } = await createTestUser({
            email: "newmem@test.com",
        });
        const team = await createTestTeam(user._id, { teamName: "AddMemTeam" });

        const res = await request(app)
            .post(`/api/v1/team/add-member/${team._id}`)
            .set("Authorization", authHeader(token))
            .send({ email: "newmem@test.com", roleInTeam: "developer" });

        expect(res.status).toBe(200);
        expect(res.body.data.roleInTeam).toBe("developer");
    });

    it("should reject adding non-registered user", async () => {
        const { token, user } = await createTestUser({ email: "addunk@test.com" });
        const team = await createTestTeam(user._id, { teamName: "NoUserTeam" });

        const res = await request(app)
            .post(`/api/v1/team/add-member/${team._id}`)
            .set("Authorization", authHeader(token))
            .send({ email: "unknown@test.com", roleInTeam: "developer" });

        expect(res.status).toBe(404);
    });

    it("should reject duplicate member", async () => {
        const { token, user } = await createTestUser({ email: "dup@test.com" });
        const { user: member } = await createTestUser({
            email: "dupmem@test.com",
        });
        const team = await createTestTeam(user._id, {
            teamName: "DupMemTeam",
            members: [{ user: member._id, roleInTeam: "developer", status: "active" }],
        });

        const res = await request(app)
            .post(`/api/v1/team/add-member/${team._id}`)
            .set("Authorization", authHeader(token))
            .send({ email: "dupmem@test.com", roleInTeam: "member" });

        expect(res.status).toBe(409);
    });

    it("should reject adding member to archived team", async () => {
        const { token, user } = await createTestUser({
            email: "archowner@test.com",
        });
        const { user: member } = await createTestUser({
            email: "archmem@test.com",
        });
        const team = await createTestTeam(user._id, {
            teamName: "ArchTeam",
            status: "ARCHIVED",
            isActive: false,
        });

        const res = await request(app)
            .post(`/api/v1/team/add-member/${team._id}`)
            .set("Authorization", authHeader(token))
            .send({ email: "archmem@test.com", roleInTeam: "member" });

        expect(res.status).toBe(400);
    });

    it("should enforce single team lead rule", async () => {
        const { token, user } = await createTestUser({ email: "tl@test.com" });
        const { user: existing } = await createTestUser({
            email: "existingtl@test.com",
        });
        const { user: newMember } = await createTestUser({
            email: "newtl@test.com",
        });
        const team = await createTestTeam(user._id, {
            teamName: "TLTeam",
            members: [
                { user: existing._id, roleInTeam: "team lead", status: "active" },
            ],
        });

        const res = await request(app)
            .post(`/api/v1/team/add-member/${team._id}`)
            .set("Authorization", authHeader(token))
            .send({ email: "newtl@test.com", roleInTeam: "team lead" });

        expect(res.status).toBe(400);
    });

    it("should get all team members", async () => {
        const { token, user } = await createTestUser({
            email: "getmems@test.com",
        });
        const { user: m1 } = await createTestUser({ email: "m1@test.com" });
        const team = await createTestTeam(user._id, {
            teamName: "MembersTeam",
            members: [{ user: m1._id, roleInTeam: "developer", status: "active" }],
        });

        const res = await request(app)
            .get(`/api/v1/team/get-all-members/${team._id}`)
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);
        expect(res.body.data.members.length).toBeGreaterThanOrEqual(1);
    });

    it("should update a team member's role", async () => {
        const { token, user } = await createTestUser({ email: "uprole@test.com" });
        const { user: member } = await createTestUser({
            email: "uprole2@test.com",
        });
        const team = await createTestTeam(user._id, {
            teamName: "UpRoleTeam",
            members: [
                { user: member._id, roleInTeam: "developer", status: "active" },
            ],
        });

        const res = await request(app)
            .post(`/api/v1/team/update-member/${team._id}/${member._id}`)
            .set("Authorization", authHeader(token))
            .send({ roleInTeam: "tester", status: "active" });

        expect(res.status).toBe(200);
        expect(res.body.data.updatedMember.roleInTeam).toBe("tester");
    });

    it("should remove a team member", async () => {
        const { token, user } = await createTestUser({ email: "rm@test.com" });
        const { user: member } = await createTestUser({ email: "rm2@test.com" });
        const team = await createTestTeam(user._id, {
            teamName: "RemoveTeam",
            members: [
                { user: member._id, roleInTeam: "developer", status: "active" },
            ],
        });

        const res = await request(app)
            .post(`/api/v1/team/remove-member/${team._id}/${member._id}`)
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);

        const updatedTeam = await Team.findById(team._id);
        const found = updatedTeam.members.find(
            (m) => m.user.toString() === member._id.toString(),
        );
        expect(found).toBeUndefined();
    });
});

describe("Team Status API - PATCH /api/v1/team/:teamId/status", () => {
    it("should update team status to ARCHIVED", async () => {
        const { token, user } = await createTestUser({
            role: "super_admin",
            email: "archiveadmin@test.com",
        });
        const team = await createTestTeam(user._id, { teamName: "ArchTeam2" });

        const res = await request(app)
            .patch(`/api/v1/team/${team._id}/status`)
            .set("Authorization", authHeader(token))
            .send({ status: "ARCHIVED" });

        expect(res.status).toBe(200);
        expect(res.body.data.status).toBe("ARCHIVED");
        expect(res.body.data.isActive).toBe(false);
    });

    it("should reject invalid status", async () => {
        const { token, user } = await createTestUser({
            role: "super_admin",
            email: "badst@test.com",
        });
        const team = await createTestTeam(user._id, { teamName: "BadstTeam" });

        const res = await request(app)
            .patch(`/api/v1/team/${team._id}/status`)
            .set("Authorization", authHeader(token))
            .send({ status: "DELETED" });

        expect(res.status).toBe(400);
    });
});
