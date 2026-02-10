import http from "http";
import app from "./app.js";
import dotenv from "dotenv";
import { initSocket } from "./socket/index.js";
import Dbconnect from "./config/DbConnect.js";
dotenv.config();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize socket
initSocket(server);

Dbconnect()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`server started on this port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
