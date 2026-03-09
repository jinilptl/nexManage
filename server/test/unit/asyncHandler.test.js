import { describe, it, expect, vi } from "vitest";
import asyncHandler from "../../utils/asyncHandler.js";

describe("asyncHandler", () => {
    it("should call the handler function with req, res, next", async () => {
        const handler = vi.fn().mockResolvedValue(undefined);
        const wrapped = asyncHandler(handler);

        const req = {};
        const res = {};
        const next = vi.fn();

        await wrapped(req, res, next);

        expect(handler).toHaveBeenCalledWith(req, res, next);
        expect(next).not.toHaveBeenCalled();
    });

    it("should call next with the error if handler throws", async () => {
        const error = new Error("Test error");
        const handler = vi.fn().mockRejectedValue(error);
        const wrapped = asyncHandler(handler);

        const req = {};
        const res = {};
        const next = vi.fn();

        await wrapped(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });

    it("should handle synchronous errors in the handler", async () => {
        const error = new Error("Sync error");
        const handler = vi.fn(() => {
            throw error;
        });
        const wrapped = asyncHandler(handler);

        const req = {};
        const res = {};
        const next = vi.fn();

        await wrapped(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });

    it("should return a function", () => {
        const wrapped = asyncHandler(() => { });
        expect(typeof wrapped).toBe("function");
    });
});
