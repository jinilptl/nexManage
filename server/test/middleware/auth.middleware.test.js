import { describe, it, expect, vi } from "vitest";
import jwt from "jsonwebtoken";
import { verifyToken } from "../../middlewares/authMiddlewares/varifyToken.middlewares.js";
import { roleChecker } from "../../middlewares/authMiddlewares/roleChecker.middlewares.js";
import { isNotObserver } from "../../middlewares/taskMiddlewares/isNotObserver.middlewares.js";

describe("verifyToken Middleware", () => {
    it("should attach user to req on valid token", async () => {
        const payload = { _id: "123", name: "Test", email: "t@t.com", role: "member" };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        const req = {
            cookies: { token },
            headers: {},
        };
        const res = {};
        const next = vi.fn();

        await verifyToken(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user).toBeDefined();
        expect(req.user._id).toBe("123");
        expect(req.user.email).toBe("t@t.com");
    });

    it("should also work with Authorization header", async () => {
        const payload = { _id: "456", name: "Header", email: "h@t.com", role: "admin" };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        const req = {
            cookies: {},
            headers: {
                authorization: `Bearer ${token}`,
            },
        };
        const res = {};
        const next = vi.fn();

        await verifyToken(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user._id).toBe("456");
    });

    it("should call next with error when no token provided", async () => {
        const req = { cookies: {}, headers: {} };
        const res = {};
        const next = vi.fn();

        await verifyToken(req, res, next);

        expect(next).toHaveBeenCalled();
        const callArg = next.mock.calls[0][0];
        expect(callArg).toBeDefined();
        expect(callArg.statusCode).toBe(401);
    });

    it("should reject invalid token", async () => {
        const req = {
            cookies: { token: "invalid-token-string" },
            headers: {},
        };
        const res = {};
        const next = vi.fn();

        await verifyToken(req, res, next);

        const callArg = next.mock.calls[0][0];
        expect(callArg).toBeDefined();
        expect(callArg.statusCode).toBe(401);
    });

    it("should reject expired token", async () => {
        const payload = { _id: "789", name: "Expired", email: "e@t.com", role: "member" };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "0s" });

        await new Promise((r) => setTimeout(r, 1500));

        const req = {
            cookies: { token },
            headers: {},
        };
        const res = {};
        const next = vi.fn();

        await verifyToken(req, res, next);

        const callArg = next.mock.calls[0][0];
        expect(callArg).toBeDefined();
        expect(callArg.statusCode).toBe(401);
    });
});

describe("roleChecker Middleware", () => {
    it("should allow user with permitted role", () => {
        const middleware = roleChecker(["admin", "super_admin"]);

        const req = { user: { role: "admin" } };
        const res = {};
        const next = vi.fn();

        middleware(req, res, next);

        expect(next).toHaveBeenCalledWith();
    });

    it("should block user with unpermitted role", () => {
        const middleware = roleChecker(["super_admin"]);

        const req = { user: { role: "member" } };
        const res = {};
        const next = vi.fn();

        expect(() => middleware(req, res, next)).toThrow();
    });

    it("should block when role is missing", () => {
        const middleware = roleChecker(["admin"]);

        const req = { user: {} };
        const res = {};
        const next = vi.fn();

        expect(() => middleware(req, res, next)).toThrow();
    });
});

describe("isNotObserver Middleware", () => {
    it("should allow non-observer", async () => {
        const req = { roleInProject: "developer", user: {} };
        const res = {};
        const next = vi.fn();

        await isNotObserver(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it("should block observer role", async () => {
        const req = { roleInProject: "observer", user: {} };
        const res = {};
        const next = vi.fn();

        await isNotObserver(req, res, next);

        const callArg = next.mock.calls[0][0];
        expect(callArg).toBeDefined();
        expect(callArg.statusCode).toBe(403);
    });

    it("should block temp member", async () => {
        const req = { roleInProject: "developer", user: { isTempMember: true } };
        const res = {};
        const next = vi.fn();

        await isNotObserver(req, res, next);

        const callArg = next.mock.calls[0][0];
        expect(callArg).toBeDefined();
        expect(callArg.statusCode).toBe(403);
    });
});
