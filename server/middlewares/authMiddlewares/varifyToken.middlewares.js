import jwt from "jsonwebtoken";
import asyncHandler from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";

const verifyToken = asyncHandler(async (req, res, next) => {
  const token =
    req?.cookies?.token || req?.headers?.authorization?.split(" ")[1];

  // console.log("token is value ", token);

  if (!token) {
    throw new ApiError(400, "unauthorized access");
  }

  let cleanedToken = token.replace(/^"|"$/g, "");

  jwt.verify(cleanedToken, process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      throw new ApiError(400, "invalid token or token expired");
    }
    req.user = decode;

    next();
  });
});

export { verifyToken };
