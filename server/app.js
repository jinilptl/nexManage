import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import teamRouter from "./routes/team.routes.js";
import projectRouter from "./routes/project.routes.js";
import taskRouter from "./routes/tasksRoutes/task.routes.js";
import fileUploadRouter from "./routes/tasksRoutes/fileUpload.routes.js";
import subTaskRouter from "./routes/tasksRoutes/subTask.routes.js";
import activityTaskRouter from "./routes/tasksRoutes/activityLogs.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express();

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173", "http://localhost:4173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

//routes

app.use("/api/v1/user", authRouter);
app.use("/api/v1/team", teamRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/project/task", taskRouter);
app.use("/api/v1/project/task/subtask", subTaskRouter);
app.use("/api/v1/project/task", fileUploadRouter);
app.use("/api/v1/project/task", activityTaskRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/users", userRouter);

// error handler global formate

app.use((err, req, res, next) => {
  console.log(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error ";
  const errors = err.errors || [];

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
});

app.get("/", (req, res) => {
  res.send("default route .. welcome to the server of nexmanage");
});

export default app;
