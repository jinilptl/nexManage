import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError.js";

const verifySocketToken = (token) => {
  if (!token) {
    throw new ApiError(400,"Token missing in verifySocketToken");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded; 
};

export { verifySocketToken };
