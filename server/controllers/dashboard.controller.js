import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/Task models/task.models.js";

export const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.role === "admin" || req.user.role === "super_admin";

  /* -------------------- USER PROJECT IDS (IMPORTANT FIX) -------------------- */
  const userProjectIds = await Project.find({
    status: "active",
    "projectMembers.user": userId,
    "projectMembers.status": "active",
  }).distinct("_id");

  /* -------------------- ACTIVE PROJECTS -------------------- */
  const activeProjects = await Project.countDocuments({
    _id: { $in: userProjectIds },
  });

  /* -------------------- TASK COUNTS -------------------- */
  const myTasksCount = await Task.countDocuments(
    isAdmin ? { project: { $in: userProjectIds } } : { assignees: userId },
  );

  const completedThisWeek = await Task.countDocuments({
    project: { $in: userProjectIds },
    ...(isAdmin ? {} : { assignees: userId }),
    completedAt: {
      $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  });

  /* -------------------- PROJECTS FOR STATUS MAP -------------------- */
  const projects = await Project.find({
    _id: { $in: userProjectIds },
  }).select("taskStatuses");

  const statusIdsMap = {
    todo: [],
    in_progress: [],
    review: [],
  };

  projects.forEach((project) => {
    project.taskStatuses?.forEach((status) => {
      if (statusIdsMap[status.key]) {
        statusIdsMap[status.key].push(status._id);
      }
    });
  });

  /* -------------------- TASK STATUS COUNTS -------------------- */
  const baseTaskFilter = {
    project: { $in: userProjectIds },
    ...(isAdmin ? {} : { assignees: userId }),
  };

  const [todoCount, inProgressCount, pendingReviews] = await Promise.all([
    statusIdsMap.todo.length
      ? Task.countDocuments({
          ...baseTaskFilter,
          status: { $in: statusIdsMap.todo },
        })
      : 0,

    statusIdsMap.in_progress.length
      ? Task.countDocuments({
          ...baseTaskFilter,
          status: { $in: statusIdsMap.in_progress },
        })
      : 0,

    statusIdsMap.review.length
      ? Task.countDocuments({
          ...baseTaskFilter,
          status: { $in: statusIdsMap.review },
        })
      : 0,
  ]);

  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const recentActivity = await Task.find({
    project: { $in: userProjectIds },
    updatedAt: { $gte: last24Hours },
  })
    .sort({ updatedAt: -1 })
    .populate("updatedBy", "name")
    .lean();

  /* -------------------- UPCOMING DEADLINES -------------------- */
  const now = new Date();
  const next7Days = new Date();
  next7Days.setDate(now.getDate() + 7);

  const upcomingDeadlines = await Task.find({
    project: { $in: userProjectIds },
    ...(isAdmin ? {} : { assignees: userId }),
    dueDate: { $gte: now, $lte: next7Days },
  })
    .sort({ dueDate: 1 })
    .limit(5)
    .select("title dueDate priority")
    .lean();

  /* -------------------- PROJECT PROGRESS -------------------- */
  const userProjects = await Project.find({
    _id: { $in: userProjectIds },
  }).select("projectName taskStatuses");

  const projectProgress = [];

  for (const project of userProjects) {
    const doneStatus = project.taskStatuses?.find((s) => s.key === "done");

    const totalTasks = await Task.countDocuments({
      project: project._id,
    });

    const doneTasks = doneStatus
      ? await Task.countDocuments({
          project: project._id,
          status: doneStatus._id,
        })
      : 0;

    const progress =
      totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

    projectProgress.push({
      id: project._id,
      name: project.projectName,
      progress,
    });
  }

  /* -------------------- RESPONSE -------------------- */
  res.status(200).json(
    new ApiResponse(200, {
      activeProjects,
      myTasksCount,
      completedThisWeek,
      todoCount,
      inProgressCount,
      pendingReviews,
      recentActivity,
      upcomingDeadlines,
      projectProgress,
    }),
  );
});
