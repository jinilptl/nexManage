import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Homepage/HomePage";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ForgotPassword/ResetPasswordPage";
import { useSelector } from "react-redux";
import DashboardPage from "./pages/DashBoard/DashboardPage";
import Dashboard from "./components/Dashboard";
import ProjectPage from "./pages/DashBoard/ProjectPage";

import TeamsPage from "./pages/DashBoard/TeamsPage";

import ProtectedWrapper from "./components/Wrappers/ProtectedWrapper";
import NotFoundPage from "./pages/NotFoundPage";
import ProjectDetails from "./pages/DashBoard/Projectdetails"

const App = () => {
  const { user, token } = useSelector((state) => state.auth);
  const DUMMY_TASKS = [
    {
      id: "t1",
      title: "Optimize image loading",
      status: "todo",
      priority: "medium",
      tags: ["frontend", "performance"],
      attachments: 1,
      comments: 2,
      dueDate: "Feb 5",
      overdue: false,
      assignee: {
        name: "Aarav",
        avatar: "https://i.pravatar.cc/100?img=11",
      },
    },
    {
      id: "t2",
      title: "User testing and feedback",
      status: "todo",
      priority: "low",
      tags: ["research"],
      attachments: 0,
      comments: 0,
      dueDate: "Feb 10",
      overdue: false,
      assignee: {
        name: "Isha",
        avatar: "https://i.pravatar.cc/100?img=32",
      },
    },
    {
      id: "t3",
      title: "Implement responsive navigation",
      status: "in_progress",
      priority: "high",
      tags: ["frontend", "bug"],
      attachments: 1,
      comments: 3,
      dueDate: "Jan 30",
      overdue: true,
      assignee: {
        name: "Rahul",
        avatar: "https://i.pravatar.cc/100?img=14",
      },
    },
    {
      id: "t4",
      title: "Setup design system tokens",
      status: "review",
      priority: "medium",
      tags: ["design"],
      attachments: 0,
      comments: 2,
      dueDate: "Jan 29",
      overdue: true,
      assignee: {
        name: "Neha",
        avatar: "https://i.pravatar.cc/100?img=47",
      },
    },
    {
      id: "t5",
      title: "Design homepage mockups",
      status: "done",
      priority: "high",
      tags: ["design", "frontend"],
      attachments: 2,
      comments: 5,
      dueDate: "Jan 20",
      overdue: false,
      assignee: {
        name: "Kunal",
        avatar: "https://i.pravatar.cc/100?img=22",
      },
    },
  ];

  const handleTaskClick = (task) => {
    console.log("Open task detail modal:", task);
  };

  const handleAddTask = (status) => {
    console.log("Add new task in column:", status);
  };

  const handleMoveTask = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedWrapper>
              <DashboardPage />
            </ProtectedWrapper>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/dashboard/teams" element={<TeamsPage />} />
          <Route path="/dashboard/projects" element={<ProjectPage />} />

          <Route path="/dashboard/projects/task" element={<ProjectDetails />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;
