import { Server } from "socket.io";
import { socketAuth } from "../middlewares/socketMiddlewares/socketAuth.js";
import { ApiError } from "../utils/ApiError.js";
let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"],
    },
  });
  
//Socket authentication
  socketAuth(io)

  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new ApiError("Socket.io not initialized");
  }
  return io;
};

export { initSocket, getIO };
