import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import { Project } from "../../models/project.models.js";

describe("Project Model", () => {
    it("should create a project with all defaults", async () => {
        const userId = new mongoose.Types.ObjectId();
        const project = await Project.create({
            projectName: "My Project",
            createdBy: userId,
            taskStatuses: [
                { key: "todo", label: "To Do", order: 1, isDefault: true },
                { key: "done", label: "Done", order: 2 },
            ],
        });

        expect(project._id).toBeDefined();
        expect(project.projectName).toBe("My Project");
        expect(project.description).toBe("");
        expect(project.projectType).toBe("team");
        expect(project.status).toBe("ACTIVE");
        expect(project.projectMembers).toEqual([]);
        expect(project.teams).toEqual([]);
        expect(project.taskStatuses).toHaveLength(2);
    });

    it("should fail if projectName is missing", async () => {
        await expect(
            Project.create({ createdBy: new mongoose.Types.ObjectId() }),
        ).rejects.toThrow();
    });

    it("should fail if createdBy is missing", async () => {
        await expect(
            Project.create({ projectName: "NoCreator" }),
        ).rejects.toThrow();
    });

    it("should accept valid projectType values", async () => {
        const userId = new mongoose.Types.ObjectId();
        for (const type of ["team", "personal", "mixed"]) {
            const p = await Project.create({
                projectName: `${type}-project-${Date.now()}`,
                createdBy: userId,
                projectType: type,
                taskStatuses: [{ key: "todo", label: "To Do", order: 1, isDefault: true }],
            });
            expect(p.projectType).toBe(type);
        }
    });

    it("should reject invalid projectType", async () => {
        await expect(
            Project.create({
                projectName: "BadType",
                createdBy: new mongoose.Types.ObjectId(),
                projectType: "invalid",
            }),
        ).rejects.toThrow();
    });

    it("should accept valid status values", async () => {
        for (const status of ["ACTIVE", "COMPLETED", "ON_HOLD", "ARCHIVED"]) {
            const p = await Project.create({
                projectName: `p-${status}-${Date.now()}`,
                createdBy: new mongoose.Types.ObjectId(),
                status,
                taskStatuses: [{ key: "todo", label: "To Do", order: 1, isDefault: true }],
            });
            expect(p.status).toBe(status);
        }
    });

    it("should reject invalid status values", async () => {
        await expect(
            Project.create({
                projectName: "BadStatus",
                createdBy: new mongoose.Types.ObjectId(),
                status: "DELETED",
            }),
        ).rejects.toThrow();
    });

    it("should store project members with role and status", async () => {
        const userId = new mongoose.Types.ObjectId();
        const memberId = new mongoose.Types.ObjectId();
        const project = await Project.create({
            projectName: "WithMembers",
            createdBy: userId,
            taskStatuses: [{ key: "todo", label: "To Do", order: 1, isDefault: true }],
            projectMembers: [
                {
                    user: memberId,
                    roleInProject: "developer",
                    status: "active",
                },
            ],
        });

        expect(project.projectMembers).toHaveLength(1);
        expect(project.projectMembers[0].roleInProject).toBe("developer");
        expect(project.projectMembers[0].status).toBe("active");
    });

    it("should reject invalid roleInProject", async () => {
        await expect(
            Project.create({
                projectName: "BadRole",
                createdBy: new mongoose.Types.ObjectId(),
                taskStatuses: [{ key: "todo", label: "To Do", order: 1, isDefault: true }],
                projectMembers: [
                    {
                        user: new mongoose.Types.ObjectId(),
                        roleInProject: "ceo",
                        status: "active",
                    },
                ],
            }),
        ).rejects.toThrow();
    });
});
