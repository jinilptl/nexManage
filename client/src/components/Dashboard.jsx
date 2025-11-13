import React from "react";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  User,
  MessageSquare,
  FileText,
  Users,
} from "lucide-react";
import DashboardHearderCard from "./DashboardHearderCard";

export default function Dashboard() {
  const DashBoardCardData = [
    {
      heading: "Active Projects",
      mainIcon: <FolderKanban className="h-4 w-4 text-blue-600" />,
      data: 6,
      text: "+2 this month",
      textColor: "text-green-600",
    },

    {
      heading: "Tasks Assigned to Me",
      mainIcon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
      data: 12,
      text: "5 active tasks",
      textColor: "text-gray-500",
    },
    {
      heading: "Completed This Week",
      mainIcon: <Clock className="h-4 w-4 text-purple-600" />,
      data: 8,
      text: "Great progress!",
      textColor: "text-gray-500",
    },
    {
      heading: "Pending Reviews",
      mainIcon: <AlertCircle className="h-4 w-4 text-orange-600" />,
      data: 3,
      text: "Needs attention",
      textColor: "text-gray-500",
    },
  ];

  const tasks = [
    { label: "To Do", color: "bg-slate-500", count: 3 },
    { label: "In Progress", color: "bg-blue-500", count: 5 },
    { label: "Review", color: "bg-orange-500", count: 2 },
    { label: "Done", color: "bg-green-500", count: 10 },
  ];

  const recentActivity = [
    {
      name: "Aarav Mehta",
      action: "completed task",
      item: "UI design for homepage",
      time: "2h ago",
    },
    {
      name: "Riya Shah",
      action: "commented on",
      item: "Project dashboard revamp",
      time: "3h ago",
    },
    {
      name: "Dev Patel",
      action: "created project",
      item: "API Refactor",
      time: "1 day ago",
    },
    {
      name: "Nisha Kumar",
      action: "updated task",
      item: "Mobile UI Testing",
      time: "2 days ago",
    },
  ];

  const deadlines = [
    { key: "WEB-1", title: "Login Page Redesign", dueIn: 2, priority: "high" },
    {
      key: "API-3",
      title: "Auth Middleware Update",
      dueIn: 4,
      priority: "medium",
    },
  ];

  const projects = [
    {
      id: 1,
      name: "Website Revamp",
      icon: <FolderKanban className="w-4 h-4" />,
      progress: 72,
    },
    {
      id: 2,
      name: "Mobile App",
      icon: <Users className="w-4 h-4" />,
      progress: 45,
    },
    {
      id: 3,
      name: "API Integration",
      icon: <FileText className="w-4 h-4" />,
      progress: 90,
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Welcome back, Boss 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        {DashBoardCardData.map((card) => (
          <DashboardHearderCard
            heading={card.heading}
            mainIcon={card.mainIcon}
            data={card.data}
            text={card.text}
            textColor={card.textColor}
          />
        ))}
      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Tasks */}
        <div className="bg-white p-4 rounded-xl shadow-sm  ">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">My Tasks</h3>
          <p className="text-sm text-gray-500 mb-4">
            Quick overview of your assigned tasks
          </p>

          <div className="space-y-3">
            {tasks.map((task, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${task.color}`}></div>
                    <span className="text-sm text-gray-700">{task.label}</span>
                  </div>
                  <span className="text-sm text-gray-500">{task.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-4 rounded-xl shadow-sm  ">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Recent Activity
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Latest updates across your projects
          </p>

          <div className="space-y-4">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                  {a.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{a.name}</span>{" "}
                    <span className="text-gray-500">{a.action}</span>{" "}
                    <span className="text-gray-800">{a.item}</span>
                  </p>
                  <p className="text-xs text-gray-500">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white p-4 rounded-xl shadow-sm  ">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upcoming Deadlines
          </h3>
          <p className="text-sm text-gray-500 mb-4">Tasks due within 7 days</p>

          {deadlines.map((d, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg   mb-2 ${
                d.dueIn <= 1
                  ? " -red-300 bg-red-50 text-red-700"
                  : " -blue-200 bg-blue-50 text-blue-700"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium bg-white   px-2 py-0.5 rounded">
                      {d.key}
                    </span>
                    <span className="text-sm">{d.title}</span>
                  </div>
                  <p className="text-xs opacity-75">
                    Due in {d.dueIn} {d.dueIn === 1 ? "day" : "days"}
                  </p>
                </div>
                {d.priority === "high" && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Project Progress */}
        <div className="bg-white p-4 rounded-xl shadow-sm  ">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Project Progress
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Completion status of active projects
          </p>

          {projects.map((p) => (
            <div key={p.id} className="space-y-2 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{p.icon}</span>
                  <span className="text-sm text-gray-800">{p.name}</span>
                </div>
                <span className="text-sm text-gray-500">{p.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${p.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                {p.progress}% tasks completed
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
