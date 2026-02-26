import { ApiError } from "../../utils/ApiError.js";
import { verifySocketToken } from "../../utils/verifySocketToken.js";

const socketAuth = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication token missing"));
      }

      const user = verifySocketToken(token);

      if (!user) {
        return next(new Error("Invalid token"));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication failed"));
    }
  });
};

export { socketAuth };
