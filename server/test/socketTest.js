import { io } from "socket.io-client";
const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTA4MzRjN2Y3OTk2MjVmYTgzM2EzNjYiLCJuYW1lIjoiamluaWwgUGF0ZWwiLCJlbWFpbCI6ImppbmlsQG5leGZvcmdlLnRlY2giLCJyb2xlIjoic3VwZXJfYWRtaW4iLCJpYXQiOjE3NjY0NjMzODcsImV4cCI6MTc2NjYzNjE4N30.8kUk4recVb31-szB8SuLfTotkyBXpjxBBhijrJMZWXs"
const socket = io("http://localhost:5000", {
  auth: {
    token: `${token}`
  }
});


socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);

  socket.emit("join-project",{
  projectId:"6944efefbaf665ac4b3debef"
})


//   socket.emit("leave-project",{
//   projectId:"6944efefbaf665ac4b3debef"
// })
});

socket.on("connect_error", (err) => {
  console.log("❌ Error:", err.message);
});


