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

      socket.user = user; // attach user to socket
      next(); // ✅ SUCCESS
    } catch (error) {
      console.log(" Socket auth error:", error.message);
      next(new Error("Authentication failed")); // ✅ THIS
    }
  });
};

export { socketAuth };
