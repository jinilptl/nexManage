import { Server } from "socket.io";
import { socketAuth } from "../middlewares/socketMiddlewares/socketAuth.js";
import { ApiError } from "../utils/ApiError.js";
import { registerRoomHandlers } from "./socketRooms.js";
import { log } from "console";
let io;
console.log("req comes in this ");

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  socketAuth(io);

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);
    console.log("👤 User:", socket.user._id);

    socket.emit("server-message", "Hello from server 👋");

    // Receive message from client
    socket.on("client-message",(data)=>{
      console.log("client message-->",data);
      
    })


    registerRoomHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
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
