import { describe, it, expect } from "vitest";
import { ApiError } from "../../utils/ApiError.js";

describe("ApiError", () => {
    it("should create an error with statusCode and message", () => {
        const error = new ApiError(400, "Bad request");
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(ApiError);
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe("Bad request");
        expect(error.success).toBe(false);
        expect(error.data).toBeNull();
        expect(error.errors).toEqual([]);
    });

    it("should use default message when none provided", () => {
        const error = new ApiError(500);
        expect(error.message).toBe("something went wrong");
        expect(error.statusCode).toBe(500);
    });

    it("should accept an errors array", () => {
        const errors = [{ field: "email", message: "invalid email" }];
        const error = new ApiError(422, "Validation failed", errors);
        expect(error.errors).toEqual(errors);
        expect(error.statusCode).toBe(422);
    });

    it("should have a stack trace", () => {
        const error = new ApiError(500, "server error");
        expect(error.stack).toBeDefined();
        expect(typeof error.stack).toBe("string");
        expect(error.stack.length).toBeGreaterThan(0);
    });

    it("should set success to false for all status codes", () => {
        expect(new ApiError(200, "ok").success).toBe(false);
        expect(new ApiError(404, "not found").success).toBe(false);
        expect(new ApiError(500, "error").success).toBe(false);
    });
});
