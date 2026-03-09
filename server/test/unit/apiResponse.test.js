import { describe, it, expect } from "vitest";
import { ApiResponse } from "../../utils/ApiResponse.js";

describe("ApiResponse", () => {
    it("should set success to true for status codes < 400", () => {
        const res200 = new ApiResponse(200, "OK", { id: 1 });
        expect(res200.statusCode).toBe(200);
        expect(res200.success).toBe(true);
        expect(res200.message).toBe("OK");
        expect(res200.data).toEqual({ id: 1 });

        const res201 = new ApiResponse(201, "Created");
        expect(res201.success).toBe(true);

        const res301 = new ApiResponse(301, "Redirect");
        expect(res301.success).toBe(true);
    });

    it("should set success to false for status codes >= 400", () => {
        expect(new ApiResponse(400, "Bad Request").success).toBe(false);
        expect(new ApiResponse(404, "Not Found").success).toBe(false);
        expect(new ApiResponse(500, "Server Error").success).toBe(false);
    });

    it("should allow undefined data", () => {
        const res = new ApiResponse(200, "No data");
        expect(res.data).toBeUndefined();
    });
});
