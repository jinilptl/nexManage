import { useMemo } from "react";
import { mockProjects, mockTasks, mockUsers } from "../assets/dummyData/dummyData";

export default function useAnalyticsData() {
  const data = useMemo(() => {
    // Calculate statistics
    const totalTasks = mockTasks.length;

    const completedTasks = mockTasks.filter((t) => t.status === "done").length;

    const inProgressTasks = mockTasks.filter((t) => t.status === "in_progress").length;

    const overdueTasks = mockTasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done"
    ).length;

    const completionRate =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    // Task distribution data
    const statusData = [
      {
        name: "To Do",
        value: mockTasks.filter((t) => t.status === "todo").length,
        color: "#94A3B8",
      },
      {
        name: "In Progress",
        value: inProgressTasks,
        color: "#3B82F6",
      },
      {
        name: "Review",
        value: mockTasks.filter((t) => t.status === "review").length,
        color: "#F59E0B",
      },
      {
        name: "Done",
        value: completedTasks,
        color: "#10B981",
      },
    ];

    // Priority breakdown
    const priorityData = [
      { name: "Critical", count: mockTasks.filter((t) => t.priority === "critical").length },
      { name: "High", count: mockTasks.filter((t) => t.priority === "high").length },
      { name: "Medium", count: mockTasks.filter((t) => t.priority === "medium").length },
      { name: "Low", count: mockTasks.filter((t) => t.priority === "low").length },
    ];

    // Velocity data (last 12 weeks)
    const velocityData = [
      { week: "Week 1", completed: 5 },
      { week: "Week 2", completed: 8 },
      { week: "Week 3", completed: 6 },
      { week: "Week 4", completed: 12 },
      { week: "Week 5", completed: 10 },
      { week: "Week 6", completed: 15 },
      { week: "Week 7", completed: 13 },
      { week: "Week 8", completed: 11 },
      { week: "Week 9", completed: 14 },
      { week: "Week 10", completed: 16 },
      { week: "Week 11", completed: 12 },
      { week: "Week 12", completed: 18 },
    ];

    // Contributors
    const contributors = mockUsers
      .map((user) => {
        const userTasks = mockTasks.filter((t) => t.assignees.includes(user.id));
        const completed = userTasks.filter((t) => t.status === "done").length;
        const comments = userTasks.reduce((sum, t) => sum + t.comments, 0);

        return {
          ...user,
          tasksCompleted: completed,
          comments,
          avgCompletionTime: (Math.random() * 3 + 1).toFixed(1),
        };
      })
      .sort((a, b) => b.tasksCompleted - a.tasksCompleted);

    const activeProjects = mockProjects.filter((p) => p.status === "active");

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      completionRate,
      statusData,
      priorityData,
      velocityData,
      contributors,
      activeProjects,
    };
  }, []);

  return data;
}
