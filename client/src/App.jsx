import React, { useEffect, useRef } from "react";
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
import AdminWrapper from "./components/Wrappers/AdminWrapper";
import NotFoundPage from "./pages/NotFoundPage";
import ProjectDetails from "./pages/DashBoard/Projectdetails";
import AnalyticsPage from "./pages/Analytics/AnalyticsPage";
import InviteMembers from "./pages/DashBoard/InviteMembers";
import SettingsPage from "./pages/Settings/SettingsPage";

const App = () => {
  const { user, token } = useSelector((state) => state.auth);

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

          <Route
            path="/dashboard/projects/task/:projectId"
            element={<ProjectDetails />}
          />

          <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
          <Route
            path="/dashboard/invite-members"
            element={
              <ProtectedWrapper>
                <AdminWrapper>
                  <InviteMembers />
                </AdminWrapper>
              </ProtectedWrapper>
            }
          />

          <Route path="/dashboard/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;
