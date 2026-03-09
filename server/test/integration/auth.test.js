import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { createTestUser, authHeader, generateObjectId } from "../helpers.js";
import { User } from "../../models/user.models.js";

vi.mock("../../utils/sendMail.js", () => ({
    default: vi.fn().mockResolvedValue(true),
}));

describe("Auth API - POST /api/v1/user/login", () => {
    it("should login with valid credentials", async () => {
        const { user, plainPassword } = await createTestUser({
            name: "LoginUser",
            email: "login@test.com",
            password: "password123",
            role: "member",
        });

        const res = await request(app)
            .post("/api/v1/user/login")
            .send({ email: "login@test.com", password: plainPassword });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeDefined();
        expect(res.body.data.token).toBeDefined();
        expect(res.body.data.userdDetailes).toBeDefined();
        expect(res.body.data.userdDetailes.email).toBe("login@test.com");
    });

    it("should reject login with wrong password", async () => {
        await createTestUser({
            email: "wrongpw@test.com",
            password: "correct_password",
        });

        const res = await request(app)
            .post("/api/v1/user/login")
            .send({ email: "wrongpw@test.com", password: "wrong_password" });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it("should reject login with non-existent email", async () => {
        const res = await request(app)
            .post("/api/v1/user/login")
            .send({ email: "nouser@test.com", password: "pw" });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it("should reject login with missing fields", async () => {
        const res = await request(app)
            .post("/api/v1/user/login")
            .send({ email: "only@email.com" });

        expect(res.status).toBe(400);
    });

    it("should reject login for invited users who haven't set password", async () => {
        await createTestUser({
            email: "invited@test.com",
            isInvited: true,
        });

        const res = await request(app)
            .post("/api/v1/user/login")
            .send({ email: "invited@test.com", password: "any" });

        expect(res.status).toBe(403);
    });

    it("should set httpOnly cookie on successful login", async () => {
        const { plainPassword } = await createTestUser({
            email: "cookie@test.com",
            password: "cookiepass",
        });

        const res = await request(app)
            .post("/api/v1/user/login")
            .send({ email: "cookie@test.com", password: plainPassword });

        expect(res.status).toBe(200);
        const cookies = res.headers["set-cookie"];
        expect(cookies).toBeDefined();
        expect(cookies.some((c) => c.includes("token="))).toBe(true);
    });
});

describe("Auth API - POST /api/v1/user/logout", () => {
    it("should logout successfully", async () => {
        const { token } = await createTestUser({ email: "logout@test.com" });

        const res = await request(app)
            .post("/api/v1/user/logout")
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain("logged out");
    });

    it("should reject logout without token", async () => {
        const res = await request(app).post("/api/v1/user/logout");

        expect(res.status).toBe(401);
    });
});

describe("Auth API - GET /api/v1/user/getmyprofile", () => {
    it("should return user profile", async () => {
        const { token, user } = await createTestUser({
            name: "ProfileUser",
            email: "profile@test.com",
        });

        const res = await request(app)
            .get("/api/v1/user/getmyprofile")
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe("ProfileUser");
        expect(res.body.data.email).toBe("profile@test.com");
        expect(res.body.data.password).toBeUndefined();
    });

    it("should reject without authentication", async () => {
        const res = await request(app).get("/api/v1/user/getmyprofile");
        expect(res.status).toBe(401);
    });
});

describe("Auth API - POST /api/v1/user/register (Invite User)", () => {
    it("should invite a new user (super_admin only)", async () => {
        const { token } = await createTestUser({
            role: "super_admin",
            email: "admin@test.com",
        });

        const res = await request(app)
            .post("/api/v1/user/register")
            .set("Authorization", authHeader(token))
            .send({
                name: "New Member",
                email: "newmember@test.com",
                role: "member",
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);

        const invited = await User.findOne({ email: "newmember@test.com" });
        expect(invited).toBeDefined();
        expect(invited.isInvited).toBe(true);
    });

    it("should reject invitation from non-super_admin", async () => {
        const { token } = await createTestUser({
            role: "member",
            email: "m@test.com",
        });

        const res = await request(app)
            .post("/api/v1/user/register")
            .set("Authorization", authHeader(token))
            .send({ name: "X", email: "x@test.com" });

        expect(res.status).toBe(403);
    });

    it("should reject duplicate registered email", async () => {
        const { token } = await createTestUser({
            role: "super_admin",
            email: "sa@test.com",
        });

        await createTestUser({ email: "existing@test.com" });

        const res = await request(app)
            .post("/api/v1/user/register")
            .set("Authorization", authHeader(token))
            .send({ name: "Dup", email: "existing@test.com" });

        expect(res.status).toBe(400);
    });

    it("should reject invitation without name", async () => {
        const { token } = await createTestUser({
            role: "super_admin",
            email: "admin2@test.com",
        });

        const res = await request(app)
            .post("/api/v1/user/register")
            .set("Authorization", authHeader(token))
            .send({ email: "noname@test.com" });

        expect(res.status).toBe(400);
    });
});

describe("Auth API - POST /api/v1/user/change-password", () => {
    it("should change password with valid old password", async () => {
        const { token } = await createTestUser({
            email: "changepw@test.com",
            password: "oldpassword",
        });

        const res = await request(app)
            .post("/api/v1/user/change-password")
            .set("Authorization", authHeader(token))
            .send({ oldPassword: "oldpassword", newPassword: "newpassword123" });

        expect(res.status).toBe(200);
        expect(res.body.message).toContain("changed successfully");
    });

    it("should reject with wrong old password", async () => {
        const { token } = await createTestUser({
            email: "wrongold@test.com",
            password: "correct",
        });

        const res = await request(app)
            .post("/api/v1/user/change-password")
            .set("Authorization", authHeader(token))
            .send({ oldPassword: "wrong", newPassword: "new" });

        expect(res.status).toBe(400);
    });

    it("should reject if new password is same as old", async () => {
        const { token } = await createTestUser({
            email: "samepw@test.com",
            password: "samepass",
        });

        const res = await request(app)
            .post("/api/v1/user/change-password")
            .set("Authorization", authHeader(token))
            .send({ oldPassword: "samepass", newPassword: "samepass" });

        expect(res.status).toBe(400);
    });

    it("should reject with missing fields", async () => {
        const { token } = await createTestUser({
            email: "missing@test.com",
        });

        const res = await request(app)
            .post("/api/v1/user/change-password")
            .set("Authorization", authHeader(token))
            .send({ oldPassword: "test" });

        expect(res.status).toBe(400);
    });
});

describe("Auth API - Forgot/Reset Password", () => {
    it("should send forgot password email for valid user", async () => {
        await createTestUser({ email: "forgot@test.com" });

        const res = await request(app)
            .post("/api/v1/user/forget-password")
            .send({ email: "forgot@test.com" });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it("should reject forgot password for unknown email", async () => {
        const res = await request(app)
            .post("/api/v1/user/forget-password")
            .send({ email: "unknown@test.com" });

        expect(res.status).toBe(400);
    });

    it("should reject forgot password without email", async () => {
        const res = await request(app)
            .post("/api/v1/user/forget-password")
            .send({});

        expect(res.status).toBe(400);
    });

    it("should reject reset with invalid token", async () => {
        const res = await request(app)
            .post("/api/v1/user/reset-password/invalidtoken123")
            .send({ newPassword: "newpass" });

        expect(res.status).toBe(400);
    });
});

describe("User Management API - /api/v1/users", () => {
    it("should fetch all users for admin", async () => {
        const { token } = await createTestUser({
            role: "super_admin",
            email: "fetchadmin@test.com",
        });
        await createTestUser({ email: "member1@test.com", role: "member" });
        await createTestUser({ email: "member2@test.com", role: "member" });

        const res = await request(app)
            .get("/api/v1/users/all-users")
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it("should reject fetching users for non-admin", async () => {
        const { token } = await createTestUser({
            role: "member",
            email: "nonadmin@test.com",
        });

        const res = await request(app)
            .get("/api/v1/users/all-users")
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(403);
    });

    it("should update a user", async () => {
        const { token } = await createTestUser({
            role: "super_admin",
            email: "updater@test.com",
        });
        const { user: target } = await createTestUser({ email: "target@test.com" });

        const res = await request(app)
            .put(`/api/v1/users/update-user/${target._id}`)
            .set("Authorization", authHeader(token))
            .send({ name: "Updated Name" });

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe("Updated Name");
    });

    it("should delete a user and clean up references", async () => {
        const { token, user: admin } = await createTestUser({
            role: "super_admin",
            email: "deladmin@test.com",
        });
        const { user: target } = await createTestUser({ email: "deltarget@test.com" });

        const res = await request(app)
            .delete(`/api/v1/users/delete-user/${target._id}`)
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);

        const deleted = await User.findById(target._id);
        expect(deleted).toBeNull();
    });

    it("should prevent self-deletion", async () => {
        const { token, user } = await createTestUser({
            role: "super_admin",
            email: "selfdelete@test.com",
        });

        const res = await request(app)
            .delete(`/api/v1/users/delete-user/${user._id}`)
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(400);
    });

    it("should return 404 when deleting non-existent user", async () => {
        const { token } = await createTestUser({
            role: "super_admin",
            email: "del404@test.com",
        });

        const res = await request(app)
            .delete(`/api/v1/users/delete-user/${generateObjectId()}`)
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(404);
    });
});
