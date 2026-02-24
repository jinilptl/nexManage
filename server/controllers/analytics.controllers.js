import mongoose from "mongoose";
import { Task } from "../models/Task models/task.models.js";
import { Project } from "../models/project.models.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const isAdmin = req.user.role === "admin" || req.user.role === "super_admin";

  const userProjects = await Project.find({
    "projectMembers.user": userId,
    "projectMembers.status": "active",
  }).select("_id status projectName taskStatuses");

  const allProjectIds = userProjects.map((p) => p._id);
  const activeProjectIds = userProjects
    .filter((p) => ["ACTIVE", "active"].includes(p.status))
    .map((p) => p._id);

  const baseTaskMatch = {
    project: { $in: allProjectIds },
    ...(isAdmin ? {} : { assignees: userId }),
  };

  const now = new Date();

  const getStatusIdsByKey = (projects, keys) => {
    let ids = [];
    projects.forEach((p) => {
      p.taskStatuses?.forEach((s) => {
        if (keys.includes(s.key?.toLowerCase())) {
          ids.push(s._id);
        }
      });
    });
    return ids;
  };

  const doneStatusIds = getStatusIdsByKey(userProjects, ["done"]);
  const inProgressStatusIds = getStatusIdsByKey(userProjects, ["in_progress"]);

  const totalTasks = await Task.countDocuments(baseTaskMatch);

  const completedTasks =
    doneStatusIds.length > 0
      ? await Task.countDocuments({
          ...baseTaskMatch,
          status: { $in: doneStatusIds },
        })
      : 0;

  const inProgressTasks =
    inProgressStatusIds.length > 0
      ? await Task.countDocuments({
          ...baseTaskMatch,
          status: { $in: inProgressStatusIds },
        })
      : 0;

  const overdueTasks = await Task.countDocuments({
    ...baseTaskMatch,
    status: { $nin: doneStatusIds },
    dueDate: { $lt: now },
  });

  const completionRate =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const priorityAgg = await Task.aggregate([
    { $match: baseTaskMatch },
    {
      $group: {
        _id: "$priority",
        count: { $sum: 1 },
      },
    },
  ]);

  const priorityData = ["critical", "high", "medium", "low"].map((p) => ({
    name: p.charAt(0).toUpperCase() + p.slice(1),
    count: priorityAgg.find((x) => x._id?.toLowerCase() === p)?.count || 0,
  }));

  const statusAgg = await Task.aggregate([
    { $match: baseTaskMatch },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "projInfo",
      },
    },
    { $unwind: "$projInfo" },
    { $unwind: "$projInfo.taskStatuses" },
    {
      $match: {
        $expr: {
          $eq: ["$status", "$projInfo.taskStatuses._id"],
        },
      },
    },
    {
      $group: {
        _id: {
          label: "$projInfo.taskStatuses.label",
          color: "$projInfo.taskStatuses.color",
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const statusData = statusAgg.map((s) => ({
    name: s._id.label,
    value: s.count,
    color: s._id.color || "#3b82f6",
  }));

  const velocityAgg = await Task.aggregate([
    { $match: baseTaskMatch },
    { $match: { status: { $in: doneStatusIds } } },
    {
      $match: {
        updatedAt: {
          $gte: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7 * 12),
        },
      },
    },
    {
      $group: {
        _id: {
          week: { $isoWeek: "$updatedAt" },
          year: { $isoWeekYear: "$updatedAt" },
        },
        completed: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.week": 1 },
    },
  ]);

  const velocityData = velocityAgg.map((v) => ({
    week: `W${v._id.week}`,
    completed: v.completed,
  }));

  const activeProjectsData = [];
  for (const p of userProjects) {
    if (p.status === "ARCHIVED") continue;

    const doneStatusId = p.taskStatuses?.find((s) => s.key === "done")?._id;
    const projectTotalTasks = await Task.countDocuments({ project: p._id });
    const projectDoneTasks = doneStatusId
      ? await Task.countDocuments({ project: p._id, status: doneStatusId })
      : 0;

    const progress =
      projectTotalTasks === 0
        ? 0
        : Math.round((projectDoneTasks / projectTotalTasks) * 100);

    activeProjectsData.push({
      id: p._id,
      name: p.projectName,
      icon: "📁",
      progress: progress,
      stats: {
        totalTasks: projectTotalTasks,
        completedTasks: projectDoneTasks,
      },
    });
  }

  res.status(200).json(
    new ApiResponse(200, "Analytics fetched successfully", {
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      completionRate,
      statusData,
      priorityData,
      velocityData,
      activeProjects: activeProjectsData,
    }),
  );
});