import jwt from "jsonwebtoken";
import asyncHandler from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";

const verifyToken = asyncHandler(async (req, res, next) => {
  const token =
    req?.cookies?.token || req?.headers?.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "unauthorized access");
  }

  let cleanedToken = token.replace(/^"|"$/g, "");

  try {
    const decoded = jwt.verify(cleanedToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    throw new ApiError(401, "invalid token or token expired");
  }
});

export { verifyToken };
