import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import { Task } from "../../models/Task models/task.models.js";
import { SubTask } from "../../models/Task models/subTask.models.js";
import { TaskAttachment } from "../../models/Task models/taskAttachment.models.js";
import { TaskActivityLog } from "../../models/Task models/taskActivityLog.models.js";

describe("Task Model", () => {
    it("should create a task with required fields", async () => {
        const task = await Task.create({
            title: "Test Task Title",
            priority: "medium",
            status: new mongoose.Types.ObjectId(),
            project: new mongoose.Types.ObjectId(),
            createdBy: new mongoose.Types.ObjectId(),
            assignees: [new mongoose.Types.ObjectId()],
        });

        expect(task._id).toBeDefined();
        expect(task.title).toBe("Test Task Title");
        expect(task.priority).toBe("medium");
        expect(task.order).toBe(0);
        expect(task.description).toBe("");
        expect(task.completedAt).toBeNull();
    });

    it("should fail if title is missing", async () => {
        await expect(
            Task.create({
                priority: "medium",
                status: new mongoose.Types.ObjectId(),
                project: new mongoose.Types.ObjectId(),
                createdBy: new mongoose.Types.ObjectId(),
                assignees: [new mongoose.Types.ObjectId()],
            }),
        ).rejects.toThrow();
    });

    it("should fail if title is shorter than 5 characters", async () => {
        await expect(
            Task.create({
                title: "Abcd",
                priority: "medium",
                status: new mongoose.Types.ObjectId(),
                project: new mongoose.Types.ObjectId(),
                createdBy: new mongoose.Types.ObjectId(),
                assignees: [new mongoose.Types.ObjectId()],
            }),
        ).rejects.toThrow();
    });

    it("should fail if priority is invalid", async () => {
        await expect(
            Task.create({
                title: "Valid Title",
                priority: "urgent",
                status: new mongoose.Types.ObjectId(),
                project: new mongoose.Types.ObjectId(),
                createdBy: new mongoose.Types.ObjectId(),
                assignees: [new mongoose.Types.ObjectId()],
            }),
        ).rejects.toThrow();
    });

    it("should accept all valid priority values", async () => {
        for (const priority of ["low", "medium", "high", "critical"]) {
            const t = await Task.create({
                title: `Task-${priority}`,
                priority,
                status: new mongoose.Types.ObjectId(),
                project: new mongoose.Types.ObjectId(),
                createdBy: new mongoose.Types.ObjectId(),
                assignees: [new mongoose.Types.ObjectId()],
            });
            expect(t.priority).toBe(priority);
        }
    });

    it("should fail if project is missing", async () => {
        await expect(
            Task.create({
                title: "No Project",
                priority: "low",
                status: new mongoose.Types.ObjectId(),
                createdBy: new mongoose.Types.ObjectId(),
                assignees: [new mongoose.Types.ObjectId()],
            }),
        ).rejects.toThrow();
    });
});

describe("SubTask Model", () => {
    it("should create a subtask", async () => {
        const subtask = await SubTask.create({
            task: new mongoose.Types.ObjectId(),
            title: "My Subtask",
        });

        expect(subtask._id).toBeDefined();
        expect(subtask.title).toBe("My Subtask");
        expect(subtask.completed).toBe(false);
        expect(subtask.completedAt).toBeNull();
    });

    it("should fail if task reference is missing", async () => {
        await expect(SubTask.create({ title: "No Task" })).rejects.toThrow();
    });

    it("should fail if title is missing", async () => {
        await expect(
            SubTask.create({ task: new mongoose.Types.ObjectId() }),
        ).rejects.toThrow();
    });
});

describe("TaskAttachment Model", () => {
    it("should create a file attachment", async () => {
        const att = await TaskAttachment.create({
            task: new mongoose.Types.ObjectId(),
            attachmentType: "file",
            fileUrl: "https://example.com/file.pdf",
            uploadedBy: new mongoose.Types.ObjectId(),
        });

        expect(att._id).toBeDefined();
        expect(att.attachmentType).toBe("file");
        expect(att.fileUrl).toBe("https://example.com/file.pdf");
    });

    it("should create a URL attachment", async () => {
        const att = await TaskAttachment.create({
            task: new mongoose.Types.ObjectId(),
            attachmentType: "url",
            fileUrl: "https://example.com",
            fileName: "Example Link",
            uploadedBy: new mongoose.Types.ObjectId(),
        });

        expect(att.attachmentType).toBe("url");
        expect(att.fileName).toBe("Example Link");
    });

    it("should reject invalid attachmentType", async () => {
        await expect(
            TaskAttachment.create({
                task: new mongoose.Types.ObjectId(),
                attachmentType: "video",
                fileUrl: "https://example.com",
                uploadedBy: new mongoose.Types.ObjectId(),
            }),
        ).rejects.toThrow();
    });

    it("should fail if fileUrl is missing", async () => {
        await expect(
            TaskAttachment.create({
                task: new mongoose.Types.ObjectId(),
                attachmentType: "file",
                uploadedBy: new mongoose.Types.ObjectId(),
            }),
        ).rejects.toThrow();
    });
});

describe("TaskActivityLog Model", () => {
    it("should create an activity log", async () => {
        const log = await TaskActivityLog.create({
            task: new mongoose.Types.ObjectId(),
            action: "TASK_CREATED",
            performedBy: new mongoose.Types.ObjectId(),
            meta: { title: "My Task" },
        });

        expect(log._id).toBeDefined();
        expect(log.action).toBe("TASK_CREATED");
        expect(log.meta).toEqual({ title: "My Task" });
    });

    it("should fail if action is missing", async () => {
        await expect(
            TaskActivityLog.create({
                task: new mongoose.Types.ObjectId(),
                performedBy: new mongoose.Types.ObjectId(),
            }),
        ).rejects.toThrow();
    });

    it("should fail if performedBy is missing", async () => {
        await expect(
            TaskActivityLog.create({
                task: new mongoose.Types.ObjectId(),
                action: "TASK_CREATED",
            }),
        ).rejects.toThrow();
    });
});
