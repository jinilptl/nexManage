import asyncHandler from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";

/**
 * Middleware to prevent observers from performing write operations.
 * Requires isProjectMember middleware to be run first to populate req.roleInProject.
 */
const isNotObserver = asyncHandler(async (req, res, next) => {
    if (req.roleInProject === "observer" || req.user?.isTempMember === true) {
        throw new ApiError(403, "Observers have read-only access and cannot perform this action");
    }
    next();
});

export { isNotObserver };
