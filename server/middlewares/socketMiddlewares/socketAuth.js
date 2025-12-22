import { Server } from "socket.io";
import { ApiError } from "../../utils/ApiError.js";
import { verifySocketToken } from "../../utils/verifySocketToken.js";

const socketAuth = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        throw new ApiError(400,"Authentication token missing");
      }

      const user = verifySocketToken(token);
      socket.user = user;

      next();
    } catch (error) {
      console.log("error occure in socket auth----> ", error);
      throw new ApiError(400,"Authentication failed");
    }
  });
};


export {socketAuth}