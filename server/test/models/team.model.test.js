import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import { Team } from "../../models/team.models.js";

describe("Team Model", () => {
    it("should create a team successfully", async () => {
        const team = await Team.create({
            teamName: "Dev Team",
            description: "Development team",
            createdby: new mongoose.Types.ObjectId(),
        });

        expect(team._id).toBeDefined();
        expect(team.teamName).toBe("Dev Team");
        expect(team.description).toBe("Development team");
        expect(team.isActive).toBe(true);
        expect(team.status).toBe("ACTIVE");
        expect(team.members).toEqual([]);
    });

    it("should fail if teamName is missing", async () => {
        await expect(
            Team.create({
                description: "No name",
                createdby: new mongoose.Types.ObjectId(),
            }),
        ).rejects.toThrow();
    });

    it("should fail if description is missing", async () => {
        await expect(
            Team.create({
                teamName: "NoDescTeam",
                createdby: new mongoose.Types.ObjectId(),
            }),
        ).rejects.toThrow();
    });

    it("should fail if createdby is missing", async () => {
        await expect(
            Team.create({
                teamName: "NoCreatorTeam",
                description: "desc",
            }),
        ).rejects.toThrow();
    });

    it("should enforce unique teamName", async () => {
        const userId = new mongoose.Types.ObjectId();
        await Team.create({
            teamName: "UniqueTeam",
            description: "First",
            createdby: userId,
        });
        await expect(
            Team.create({
                teamName: "UniqueTeam",
                description: "Second",
                createdby: userId,
            }),
        ).rejects.toThrow();
    });

    it("should only accept valid member roles", async () => {
        const team = await Team.create({
            teamName: "RoleTeam",
            description: "Test roles",
            createdby: new mongoose.Types.ObjectId(),
            members: [
                {
                    user: new mongoose.Types.ObjectId(),
                    roleInTeam: "developer",
                    status: "active",
                },
            ],
        });
        expect(team.members[0].roleInTeam).toBe("developer");
    });

    it("should reject invalid member roles", async () => {
        await expect(
            Team.create({
                teamName: "BadRoleTeam",
                description: "Bad role",
                createdby: new mongoose.Types.ObjectId(),
                members: [
                    {
                        user: new mongoose.Types.ObjectId(),
                        roleInTeam: "ceo",
                    },
                ],
            }),
        ).rejects.toThrow();
    });

    it("should only accept valid status values", async () => {
        await expect(
            Team.create({
                teamName: "BadStatusTeam",
                description: "Desc",
                createdby: new mongoose.Types.ObjectId(),
                status: "INVALID",
            }),
        ).rejects.toThrow();
    });
});
