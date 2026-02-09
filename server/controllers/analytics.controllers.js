import mongoose from "mongoose";
import { Task } from "../models/Task models/task.models.js";
import { Project } from "../models/project.models.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const now = new Date();

  const projectsWithStatuses = await Project.find(
    { taskStatuses: { $exists: true, $ne: [] } },
    { taskStatuses: 1 },
  ).lean();

  let doneStatusIds = [];
  let inProgressStatusIds = [];

  projectsWithStatuses.forEach((project) => {
    project.taskStatuses.forEach((status) => {
      if (status.key === "done") {
        doneStatusIds.push(status._id);
      }

      if (status.key === "in_progress") {
        inProgressStatusIds.push(status._id);
      }
    });
  });

  const totalTasks = await Task.countDocuments();

  const completedAgg = await Task.aggregate([
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
      },
    },
    { $unwind: "$project" },
    { $unwind: "$project.taskStatuses" },
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$status", "$project.taskStatuses._id"] },
            { $eq: ["$project.taskStatuses.label", "Done"] },
          ],
        },
      },
    },
    { $count: "count" },
  ]);

  const completedTasks = completedAgg[0]?.count || 0;

  const inProgressAgg = await Task.aggregate([
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
      },
    },
    { $unwind: "$project" },
    { $unwind: "$project.taskStatuses" },
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$status", "$project.taskStatuses._id"] },
            { $eq: ["$project.taskStatuses.label", "In Progress"] },
          ],
        },
      },
    },
    { $count: "count" },
  ]);

  const inProgressTasks = inProgressAgg[0]?.count || 0;

  const overdueAgg = await Task.aggregate([
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
      },
    },
    { $unwind: "$project" },
    { $unwind: "$project.taskStatuses" },
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$status", "$project.taskStatuses._id"] },
            { $ne: ["$project.taskStatuses.label", "Done"] },
          ],
        },
        dueDate: { $lt: now },
      },
    },
    { $count: "count" },
  ]);

  const overdueTasks = overdueAgg[0]?.count || 0;

  const completionRate =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const priorityAgg = await Task.aggregate([
    {
      $group: {
        _id: "$priority",
        count: { $sum: 1 },
      },
    },
  ]);

  const priorityData = ["critical", "high", "medium", "low"].map((p) => ({
    name: p.charAt(0).toUpperCase() + p.slice(1),
    count: priorityAgg.find((x) => x._id === p)?.count || 0,
  }));

  const statusAgg = await Task.aggregate([
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
      },
    },
    { $unwind: "$project" },
    { $unwind: "$project.taskStatuses" },
    {
      $match: {
        $expr: {
          $eq: ["$status", "$project.taskStatuses._id"],
        },
      },
    },
    {
      $group: {
        _id: {
          label: "$project.taskStatuses.label",
          color: "$project.taskStatuses.color",
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const statusData = statusAgg.map((s) => ({
    name: s._id.label,
    value: s.count,
    color: s._id.color || null,
  }));

  const velocityAgg = await Task.aggregate([
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
      },
    },
    { $unwind: "$project" },
    { $unwind: "$project.taskStatuses" },
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$status", "$project.taskStatuses._id"] },
            { $eq: ["$project.taskStatuses.label", "Done"] },
          ],
        },
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
    week: `Week ${v._id.week}`,
    completed: v.completed,
  }));

  const contributorsAgg = await Task.aggregate([
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
      },
    },
    { $unwind: "$project" },
    { $unwind: "$project.taskStatuses" },

    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$status", "$project.taskStatuses._id"] },
            { $eq: ["$project.taskStatuses.key", "done"] },
          ],
        },
      },
    },

    { $unwind: "$assignees" },

    {
      $group: {
        _id: "$assignees",
        tasksCompleted: { $sum: 1 },
        avgCompletionTime: {
          $avg: {
            $divide: [
              { $subtract: ["$updatedAt", "$createdAt"] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
    },

    { $sort: { tasksCompleted: -1 } },
    { $limit: 5 },
  ]);

const contributors = await User.populate(contributorsAgg, {
  path: "_id",
  select: "name email",
});

const formattedContributors = contributors
  .filter(c => c._id)
  .map((c) => ({
    id: c._id._id,
    name: c._id.name,
    avatar: null,
    tasksCompleted: c.tasksCompleted,
    comments: 0,
    avgCompletionTime: Math.round(c.avgCompletionTime || 0),
  }));


  const projectStatsAgg = await Task.aggregate([
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
      },
    },
    { $unwind: "$project" },
    { $unwind: "$project.taskStatuses" },

    {
      $match: {
        $expr: {
          $eq: ["$status", "$project.taskStatuses._id"],
        },
      },
    },

    {
      $group: {
        _id: {
          projectId: "$project._id",
          projectName: "$project.projectName",
          statusKey: "$project.taskStatuses.key",
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const projectsMap = {};

  projectStatsAgg.forEach((p) => {
    const { projectId, projectName, statusKey } = p._id;

    if (!projectsMap[projectId]) {
      projectsMap[projectId] = {
        id: projectId,
        name: projectName,
        icon: "📁",
        stats: {
          totalTasks: 0,
          completedTasks: 0,
        },
      };
    }

    projectsMap[projectId].stats.totalTasks += p.count;

    if (statusKey === "done") {
      projectsMap[projectId].stats.completedTasks += p.count;
    }
  });

  const activeProjects = Object.values(projectsMap);

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
      contributors: formattedContributors,
      activeProjects,
    }),
  );
});
