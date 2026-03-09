import { describe, it, expect } from "vitest";
import { User } from "../../models/user.models.js";

describe("User Model", () => {
    it("should create a user successfully with valid fields", async () => {
        const user = await User.create({
            name: "Alice",
            email: "alice@test.com",
            password: "hashedpassword",
            role: "member",
        });

        expect(user._id).toBeDefined();
        expect(user.name).toBe("Alice");
        expect(user.email).toBe("alice@test.com");
        expect(user.role).toBe("member");
        expect(user.isTempMember).toBe(false);
        expect(user.isObserver).toBe(false);
        expect(user.isInvited).toBe(false);
        expect(user.createdAt).toBeDefined();
        expect(user.updatedAt).toBeDefined();
    });

    it("should fail if name is missing", async () => {
        await expect(
            User.create({ email: "test@test.com", password: "abc" }),
        ).rejects.toThrow();
    });

    it("should fail if email is missing", async () => {
        await expect(
            User.create({ name: "Alice", password: "abc" }),
        ).rejects.toThrow();
    });

    it("should enforce unique email", async () => {
        await User.create({
            name: "User1",
            email: "unique@test.com",
            password: "abc",
        });
        await expect(
            User.create({ name: "User2", email: "unique@test.com", password: "abc" }),
        ).rejects.toThrow();
    });

    it("should lowercase and trim the email", async () => {
        const user = await User.create({
            name: "Bob",
            email: "  BOB@Test.COM  ",
            password: "abc",
        });
        expect(user.email).toBe("bob@test.com");
    });

    it("should default role to member", async () => {
        const user = await User.create({
            name: "Charlie",
            email: "charlie@test.com",
            password: "abc",
        });
        expect(user.role).toBe("member");
    });

    it("should only accept valid roles", async () => {
        await expect(
            User.create({
                name: "Dave",
                email: "dave@test.com",
                password: "pwd",
                role: "invalid_role",
            }),
        ).rejects.toThrow();
    });

    it("should allow password to be undefined (for invited users)", async () => {
        const user = await User.create({
            name: "Invited",
            email: "invited@test.com",
            isInvited: true,
        });
        expect(user.password).toBeUndefined();
        expect(user.isInvited).toBe(true);
    });
});
