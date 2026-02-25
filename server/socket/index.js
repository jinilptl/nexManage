import { Server } from "socket.io";
import { socketAuth } from "../middlewares/socketMiddlewares/socketAuth.js";
import { ApiError } from "../utils/ApiError.js";
import { registerRoomHandlers } from "./socketRooms.js";
let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:4173",
        "http://192.168.1.105:5173",
        process.env.CLIENT_URL,
      ].filter(Boolean),
      methods: ["GET", "POST"],
    },
  });

  socketAuth(io);

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);
    console.log("👤 User:", socket.user._id);

    socket.emit("server-message", "Hello from server 👋");

    socket.on("client-message", (data) => {
    });

    registerRoomHandlers(io, socket);

    socket.on("disconnect", () => {
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new ApiError(400, "Socket.io not initialized");
  }
  return io;
};

export { initSocket, getIO };
