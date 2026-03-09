import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import { createTaskActivityLog } from "../../utils/CreateActivityLog.js";
import { TaskActivityLog } from "../../models/Task models/taskActivityLog.models.js";

import { vi } from "vitest";
vi.mock("../../socket/index.js", () => ({
    getIO: vi.fn(() => ({
        to: vi.fn(() => ({
            emit: vi.fn(),
        })),
    })),
}));

describe("createTaskActivityLog", () => {
    it("should create an activity log entry in the database", async () => {
        const taskId = new mongoose.Types.ObjectId();
        const projectId = new mongoose.Types.ObjectId();
        const performedBy = new mongoose.Types.ObjectId();

        await createTaskActivityLog({
            taskId,
            projectId,
            action: "TASK_CREATED",
            performedBy,
            meta: { title: "Test task" },
        });

        const logs = await TaskActivityLog.find({ task: taskId });
        expect(logs).toHaveLength(1);
        expect(logs[0].action).toBe("TASK_CREATED");
        expect(logs[0].performedBy.toString()).toBe(performedBy.toString());
        expect(logs[0].meta).toEqual({ title: "Test task" });
    });

    it("should throw if required fields are missing", async () => {
        await expect(
            createTaskActivityLog({
                taskId: null,
                action: "TASK_CREATED",
                performedBy: new mongoose.Types.ObjectId(),
            }),
        ).rejects.toThrow();
    });

    it("should throw if action is missing", async () => {
        await expect(
            createTaskActivityLog({
                taskId: new mongoose.Types.ObjectId(),
                action: null,
                performedBy: new mongoose.Types.ObjectId(),
            }),
        ).rejects.toThrow();
    });

    it("should throw if performedBy is missing", async () => {
        await expect(
            createTaskActivityLog({
                taskId: new mongoose.Types.ObjectId(),
                action: "TASK_CREATED",
                performedBy: null,
            }),
        ).rejects.toThrow();
    });

    it("should throw if action is empty string", async () => {
        await expect(
            createTaskActivityLog({
                taskId: new mongoose.Types.ObjectId(),
                action: "   ",
                performedBy: new mongoose.Types.ObjectId(),
            }),
        ).rejects.toThrow();
    });

    it("should throw if taskId is not a valid ObjectId", async () => {
        await expect(
            createTaskActivityLog({
                taskId: "invalid-id",
                action: "TASK_CREATED",
                performedBy: new mongoose.Types.ObjectId(),
            }),
        ).rejects.toThrow();
    });

    it("should throw if meta is an array instead of object", async () => {
        await expect(
            createTaskActivityLog({
                taskId: new mongoose.Types.ObjectId(),
                action: "TASK_CREATED",
                performedBy: new mongoose.Types.ObjectId(),
                meta: [1, 2, 3],
            }),
        ).rejects.toThrow();
    });

    it("should default meta to empty object when not provided", async () => {
        const taskId = new mongoose.Types.ObjectId();
        const performedBy = new mongoose.Types.ObjectId();

        await createTaskActivityLog({
            taskId,
            projectId: new mongoose.Types.ObjectId(),
            action: "TASK_DELETED",
            performedBy,
        });

        const log = await TaskActivityLog.findOne({ task: taskId });
        expect(log.meta).toBeDefined();
    });
});
