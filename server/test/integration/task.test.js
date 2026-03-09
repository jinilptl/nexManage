import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../../app.js";
import {
    createTestUser,
    createTestProject,
    createTestTask,
    createTestSubTask,
    authHeader,
    generateObjectId,
} from "../helpers.js";
import { Task } from "../../models/Task models/task.models.js";
import { SubTask } from "../../models/Task models/subTask.models.js";

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

describe("Task API - Create Task", () => {
    it("should create a task successfully (project-manager)", async () => {
        const { token, user } = await createTestUser({
            email: "taskcreate@test.com",
            role: "admin",
        });
        const project = await createTestProject(user._id, {
            projectName: "TaskProj",
        });

        const res = await request(app)
            .post(`/api/v1/project/task/create-task/${project._id}`)
            .set("Authorization", authHeader(token))
            .send({
                title: "My New Task",
                priority: "high",
                assignees: [user._id],
            });

        expect(res.status).toBe(201);
        expect(res.body.data.title).toBe("My New Task");
        expect(res.body.data.priority).toBe("high");
    });

    it("should reject task with title < 5 chars", async () => {
        const { token, user } = await createTestUser({
            email: "shorttitle@test.com",
            role: "admin",
        });
        const project = await createTestProject(user._id, {
            projectName: "ShortTitleProj",
        });

        const res = await request(app)
            .post(`/api/v1/project/task/create-task/${project._id}`)
            .set("Authorization", authHeader(token))
            .send({ title: "Hi", priority: "low", assignees: [user._id] });

        expect(res.status).toBe(400);
    });

    it("should reject task with invalid priority", async () => {
        const { token, user } = await createTestUser({
            email: "badprio@test.com",
            role: "admin",
        });
        const project = await createTestProject(user._id, {
            projectName: "BadPrioProj",
        });

        const res = await request(app)
            .post(`/api/v1/project/task/create-task/${project._id}`)
            .set("Authorization", authHeader(token))
            .send({
                title: "Valid Title Here",
                priority: "urgent",
                assignees: [user._id],
            });

        expect(res.status).toBe(400);
    });

    it("should reject task with no assignees", async () => {
        const { token, user } = await createTestUser({
            email: "noassignee@test.com",
            role: "admin",
        });
        const project = await createTestProject(user._id, {
            projectName: "NoAssignProj",
        });

        const res = await request(app)
            .post(`/api/v1/project/task/create-task/${project._id}`)
            .set("Authorization", authHeader(token))
            .send({ title: "No Assignee Task", priority: "low", assignees: [] });

        expect(res.status).toBe(400);
    });

    it("should reject task with past due date", async () => {
        const { token, user } = await createTestUser({
            email: "pastdue@test.com",
            role: "admin",
        });
        const project = await createTestProject(user._id, {
            projectName: "PastDueProj",
        });
        const pastDate = new Date("2020-01-01").toISOString();

        const res = await request(app)
            .post(`/api/v1/project/task/create-task/${project._id}`)
            .set("Authorization", authHeader(token))
            .send({
                title: "Past Due Task",
                priority: "low",
                assignees: [user._id],
                dueDate: pastDate,
            });

        expect(res.status).toBe(400);
    });

    it("should reject task with non-member assignees", async () => {
        const { token, user } = await createTestUser({
            email: "badassignee@test.com",
            role: "admin",
        });
        const project = await createTestProject(user._id, {
            projectName: "BadAssignProj",
        });
        const fakeUserId = generateObjectId();

        const res = await request(app)
            .post(`/api/v1/project/task/create-task/${project._id}`)
            .set("Authorization", authHeader(token))
            .send({
                title: "Bad Assignee Task",
                priority: "low",
                assignees: [fakeUserId],
            });

        expect(res.status).toBe(400);
    });
});

describe("Task API - Get Tasks", () => {
    it("should fetch all tasks for a project", async () => {
        const { token, user } = await createTestUser({
            email: "gettasks@test.com",
            role: "admin",
        });
        const project = await createTestProject(user._id, {
            projectName: "GetTaskProj",
        });
        const statusId = project.taskStatuses[0]._id;

        await createTestTask(project._id, user._id, statusId, {
            title: "Task One One",
        });
        await createTestTask(project._id, user._id, statusId, {
            title: "Task Two Two",
        });

        const res = await request(app)
            .get(`/api/v1/project/task/project-tasks/${project._id}`)
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(2);
    });

    it("should get task details by ID", async () => {
        const { token, user } = await createTestUser({
            email: "taskdet@test.com",
            role: "admin",
        });
        const project = await createTestProject(user._id, {
            projectName: "TaskDetProj",
        });
        const statusId = project.taskStatuses[0]._id;
        const task = await createTestTask(project._id, user._id, statusId, {
            title: "Detail Task",
        });

        const res = await request(app)
            .get(`/api/v1/project/task/${project._id}/get-task/${task._id}`)
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);
        expect(res.body.data.title).toBe("Detail Task");
    });
});

describe("Task API - Update Task", () => {
    it("should update task title and priority", async () => {
        const { token, user } = await createTestUser({
            email: "updatetask@test.com",
            role: "admin",
        });
        const project = await createTestProject(user._id, {
            projectName: "UpdTaskProj",
        });
        const statusId = project.taskStatuses[0]._id;
        const task = await createTestTask(project._id, user._id, statusId, {
            title: "Old Title Here",
        });

        const res = await request(app)
            .put(`/api/v1/project/task/update-task/${project._id}/${task._id}`)
            .set("Authorization", authHeader(token))
            .send({ title: "Updated Title", priority: "critical" });

        expect(res.status).toBe(201);
        expect(res.body.data.title).toBe("Updated Title");
        expect(res.body.data.priority).toBe("critical");
    });

    it("should reject update with no valid fields", async () => {
        const { token, user } = await createTestUser({
            email: "noupd@test.com",
            role: "admin",
        });
        const project = await createTestProject(user._id, {
            projectName: "NoUpdProj",
        });
        const statusId = project.taskStatuses[0]._id;
        const task = await createTestTask(project._id, user._id, statusId);

        const res = await request(app)
            .put(`/api/v1/project/task/update-task/${project._id}/${task._id}`)
            .set("Authorization", authHeader(token))
            .send({});

        expect(res.status).toBe(400);
    });
});

describe("Task API - Delete Task", () => {
    it("should delete a task and reorder remaining", async () => {
        const { token, user } = await createTestUser({
            email: "deltask@test.com",
            role: "admin",
        });
        const project = await createTestProject(user._id, {
            projectName: "DelTaskProj",
        });
        const statusId = project.taskStatuses[0]._id;

        const task1 = await createTestTask(project._id, user._id, statusId, {
            title: "First Task",
            order: 0,
        });
        const task2 = await createTestTask(project._id, user._id, statusId, {
            title: "Second Task",
            order: 1,
        });

        const res = await request(app)
            .delete(`/api/v1/project/task/delete/${project._id}/${task1._id}`)
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);

        const remaining = await Task.findById(task2._id);
        expect(remaining.order).toBe(0);
    });
});

describe("Task API - Update Task Status", () => {
    it("should move task to a different status", async () => {
        const { token, user } = await createTestUser({
            email: "movetask@test.com",
            role: "admin",
        });
        const project = await createTestProject(user._id, {
            projectName: "MoveTaskProj",
        });
        const todoStatusId = project.taskStatuses.find((s) => s.key === "todo")._id;
        const doneStatusId = project.taskStatuses.find((s) => s.key === "done")._id;
        const task = await createTestTask(project._id, user._id, todoStatusId, {
            title: "Moveable Task",
        });

        const res = await request(app)
            .patch(`/api/v1/project/task/status/${project._id}/${task._id}`)
            .set("Authorization", authHeader(token))
            .send({ statusId: doneStatusId.toString() });

        expect(res.status).toBe(200);
        expect(res.body.data.status.toString()).toBe(doneStatusId.toString());
        expect(res.body.data.completedAt).toBeDefined();
    });

    it("should return 200 with no changes if status is the same", async () => {
        const { token, user } = await createTestUser({
            email: "samest@test.com",
            role: "admin",
        });
        const project = await createTestProject(user._id, {
            projectName: "SameStProj",
        });
        const statusId = project.taskStatuses[0]._id;
        const task = await createTestTask(project._id, user._id, statusId, {
            title: "Same Status Task",
        });

        const res = await request(app)
            .patch(`/api/v1/project/task/status/${project._id}/${task._id}`)
            .set("Authorization", authHeader(token))
            .send({ statusId: statusId.toString() });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Status unchanged");
    });
});

describe("Task API - Update Task Order", () => {
    it("should reorder a task within the same status", async () => {
        const { token, user } = await createTestUser({
            email: "reorder@test.com",
            role: "admin",
        });
        const project = await createTestProject(user._id, {
            projectName: "ReorderProj",
        });
        const statusId = project.taskStatuses[0]._id;

        const t0 = await createTestTask(project._id, user._id, statusId, {
            title: "Task at order 0",
            order: 0,
        });
        await createTestTask(project._id, user._id, statusId, {
            title: "Task at order 1",
            order: 1,
        });
        await createTestTask(project._id, user._id, statusId, {
            title: "Task at order 2",
            order: 2,
        });

        const res = await request(app)
            .patch(`/api/v1/project/task/order/${project._id}/${t0._id}`)
            .set("Authorization", authHeader(token))
            .send({ order: 2 });

        expect(res.status).toBe(200);

        const updated = await Task.findById(t0._id);
        expect(updated.order).toBe(2);
    });
});

describe("Task API - Update Assignees", () => {
    it("should update task assignees", async () => {
        const { token, user } = await createTestUser({
            email: "assup@test.com",
            role: "admin",
        });
        const { user: otherUser } = await createTestUser({
            email: "other@test.com",
        });
        const project = await createTestProject(user._id, {
            projectName: "AssUpProj",
            projectMembers: [
                { user: user._id, roleInProject: "project-manager", status: "active" },
                { user: otherUser._id, roleInProject: "developer", status: "active" },
            ],
        });
        const statusId = project.taskStatuses[0]._id;
        const task = await createTestTask(project._id, user._id, statusId, {
            title: "Assign Update",
        });

        const res = await request(app)
            .patch(
                `/api/v1/project/task/updatetask-assignees/${project._id}/${task._id}`,
            )
            .set("Authorization", authHeader(token))
            .send({ assignees: [otherUser._id] });

        expect(res.status).toBe(200);
        expect(res.body.data.assignees.length).toBe(1);
    });

    it("should reject non-project-member assignees", async () => {
        const { token, user } = await createTestUser({
            email: "badass@test.com",
            role: "admin",
        });
        const project = await createTestProject(user._id, {
            projectName: "BadAssProj",
        });
        const statusId = project.taskStatuses[0]._id;
        const task = await createTestTask(project._id, user._id, statusId, {
            title: "Bad Assignee",
        });

        const res = await request(app)
            .patch(
                `/api/v1/project/task/updatetask-assignees/${project._id}/${task._id}`,
            )
            .set("Authorization", authHeader(token))
            .send({ assignees: [generateObjectId()] });

        expect(res.status).toBe(400);
    });
});

describe("SubTask API", () => {
    it("should add a subtask to a task", async () => {
        const { token, user } = await createTestUser({
            email: "addsub@test.com",
            role: "admin",
        });
        const project = await createTestProject(user._id, {
            projectName: "SubProj",
        });
        const statusId = project.taskStatuses[0]._id;
        const task = await createTestTask(project._id, user._id, statusId, {
            title: "Parent Task",
        });

        const res = await request(app)
            .post(
                `/api/v1/project/task/subtask/${project._id}/create-subtask/${task._id}`,
            )
            .set("Authorization", authHeader(token))
            .send({ title: "My Subtask" });

        expect(res.status).toBe(201);
        expect(res.body.data.subTask.title).toBe("My Subtask");
    });

    it("should reject subtask with empty title", async () => {
        const { token, user } = await createTestUser({
            email: "emptysub@test.com",
            role: "admin",
        });
        const project = await createTestProject(user._id, {
            projectName: "EmptySubProj",
        });
        const statusId = project.taskStatuses[0]._id;
        const task = await createTestTask(project._id, user._id, statusId, {
            title: "Parent Task",
        });

        const res = await request(app)
            .post(
                `/api/v1/project/task/subtask/${project._id}/create-subtask/${task._id}`,
            )
            .set("Authorization", authHeader(token))
            .send({ title: "" });

        expect(res.status).toBe(400);
    });

    it("should get all subtasks for a task", async () => {
        const { token, user } = await createTestUser({
            email: "getsubs@test.com",
            role: "admin",
        });
        const project = await createTestProject(user._id, {
            projectName: "GetSubsProj",
        });
        const statusId = project.taskStatuses[0]._id;
        const task = await createTestTask(project._id, user._id, statusId, {
            title: "Parent For Subs",
        });

        await createTestSubTask(task._id, { title: "Sub 1" });
        await createTestSubTask(task._id, { title: "Sub 2" });

        const res = await request(app)
            .get(
                `/api/v1/project/task/subtask/${project._id}/get-subtask/${task._id}`,
            )
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(2);
    });

    it("should toggle subtask completion", async () => {
        const { token, user } = await createTestUser({
            email: "togglesub@test.com",
            role: "admin",
        });
        const project = await createTestProject(user._id, {
            projectName: "ToggleSubProj",
        });
        const statusId = project.taskStatuses[0]._id;
        const task = await createTestTask(project._id, user._id, statusId, {
            title: "Parent Toggle",
        });
        const subtask = await createTestSubTask(task._id, { title: "Toggle Me" });

        const res = await request(app)
            .patch(
                `/api/v1/project/task/subtask/${project._id}/${task._id}/complete/${subtask._id}`,
            )
            .set("Authorization", authHeader(token))
            .send({ isCompleted: true });

        expect(res.status).toBe(200);
        expect(res.body.data.completed).toBe(true);
        expect(res.body.data.completedAt).toBeDefined();
    });

    it("should delete a subtask", async () => {
        const { token, user } = await createTestUser({
            email: "delsub@test.com",
            role: "admin",
        });
        const project = await createTestProject(user._id, {
            projectName: "DelSubProj",
        });
        const statusId = project.taskStatuses[0]._id;
        const task = await createTestTask(project._id, user._id, statusId, {
            title: "Parent Delete",
        });
        const subtask = await createTestSubTask(task._id, { title: "Delete Me" });

        const res = await request(app)
            .delete(
                `/api/v1/project/task/subtask/${project._id}/${task._id}/delete/${subtask._id}`,
            )
            .set("Authorization", authHeader(token));

        expect(res.status).toBe(200);

        const deleted = await SubTask.findById(subtask._id);
        expect(deleted).toBeNull();
    });
});
