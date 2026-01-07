import { io } from "socket.io-client";
const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTA4MzRjN2Y3OTk2MjVmYTgzM2EzNjYiLCJuYW1lIjoiamluaWwgUGF0ZWwiLCJlbWFpbCI6ImppbmlsQG5leGZvcmdlLnRlY2giLCJyb2xlIjoic3VwZXJfYWRtaW4iLCJpYXQiOjE3Njc2NzM4OTAsImV4cCI6MTc2Nzg0NjY5MH0.t0ZPeWekUIPfEjUlY2IMg9CtYp81KQSzAu861cSxnf8"
const socket = io("http://localhost:5000", {
  auth: {
    token: `${token}`
  }
});


socket.on("connect", () => {
  console.log("Connected:", socket.id);

  socket.emit("join-project",{
  projectId:"6944efefbaf665ac4b3debef"
})


//   socket.emit("leave-project",{
//   projectId:"6944efefbaf665ac4b3debef"
// })
});

socket.on("connect_error", (err) => {
  console.log("Error:", err.message);
});


