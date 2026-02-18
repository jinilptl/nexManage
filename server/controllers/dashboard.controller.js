import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/Task models/task.models.js";
import { Team } from "../models/team.models.js";

export const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const isAdmin = ["admin", "super_admin"].includes(req.user.role);

  /* -------------------- PROJECT FILTER -------------------- */
  const projectFilter = isAdmin
    ? {}
    : {
      "projectMembers.user": userId,
      "projectMembers.status": "active",
    };

  const projects = await Project.find(projectFilter).select(
    "_id status projectName taskStatuses"
  );

  const allProjectIds = projects.map((p) => p._id);

  /* -------------------- TEAM COUNT -------------------- */
  const totalTeams = isAdmin
    ? await Team.countDocuments()
    : await Team.countDocuments({ "members.user": userId });

  /* -------------------- PROJECT COUNTS -------------------- */
  const totalProjects = projects.length;

  const activeProjectsCount = projects.filter(
    (p) => p.status === "ACTIVE"
  ).length;

  const completedProjectsCount = projects.filter(
    (p) => p.status === "COMPLETED"
  ).length;

  const onHoldProjectsCount = projects.filter(
    (p) => p.status === "ON_HOLD"
  ).length;

  const archivedProjectsCount = projects.filter(
    (p) => p.status === "ARCHIVED"
  ).length;

  /* -------------------- TASK FILTER -------------------- */
  const taskFilter = isAdmin
    ? {}
    : {
      assignees: userId,
    };

  const totalTasksCount = await Task.countDocuments(taskFilter);

  const completedThisWeek = await Task.countDocuments({
    ...taskFilter,
    completedAt: {
      $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  });

  /* -------------------- TASK STATUS COUNTS -------------------- */
  const statusIdsMap = {
    todo: [],
    in_progress: [],
    review: [],
  };

  projects.forEach((project) => {
    project.taskStatuses?.forEach((status) => {
      const key = status.key?.toLowerCase();
      if (statusIdsMap[key]) {
        statusIdsMap[key].push(status._id);
      }
    });
  });

  const baseTaskFilter = isAdmin
    ? {}
    : {
      assignees: userId,
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

  /* -------------------- RECENT ACTIVITY -------------------- */
  const recentActivity = await Task.find(baseTaskFilter)
    .sort({ updatedAt: -1 })
    .limit(10)
    .populate("updatedBy", "name")
    .lean();

  /* -------------------- UPCOMING DEADLINES -------------------- */
  const now = new Date();
  const next7Days = new Date();
  next7Days.setDate(now.getDate() + 7);

  const upcomingDeadlines = await Task.find({
    ...baseTaskFilter,
    dueDate: { $gte: now, $lte: next7Days },
  })
    .sort({ dueDate: 1 })
    .limit(5)
    .select("title dueDate priority")
    .lean();

  /* -------------------- PROJECT PROGRESS -------------------- */
  const projectProgress = [];

  for (const project of projects) {
    if (project.status === "ARCHIVED") continue;

    const doneStatus = project.taskStatuses?.find(
      (s) => s.key === "done"
    );

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
      totalTasks === 0
        ? 0
        : Math.round((doneTasks / totalTasks) * 100);

    projectProgress.push({
      id: project._id,
      name: project.projectName || "Unnamed Project",
      progress,
      stats: {
        totalTasks,
        completedTasks: doneTasks, // Mapping doneTasks to completedTasks for frontend consistency
      },
    });
  }

  res.status(200).json(
    new ApiResponse(200, "Dashboard data fetched successfully", {
      totalProjects,
      activeProjectsCount,
      completedProjectsCount,
      onHoldProjectsCount,
      archivedProjectsCount,
      totalTeams,
      totalTasksCount,
      completedThisWeek,
      todoCount,
      inProgressCount,
      pendingReviews,
      recentActivity,
      upcomingDeadlines,
      projectProgress,
    })
  );
});
