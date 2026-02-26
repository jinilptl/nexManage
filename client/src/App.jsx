import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Homepage/HomePage";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ForgotPassword/ResetPasswordPage";
import SetPasswordPage from "./pages/SetPassword/SetPasswordPage";
import { useSelector } from "react-redux";
import DashboardPage from "./pages/DashBoard/DashboardPage";
import Dashboard from "./components/Dashboard";
import ProjectPage from "./pages/DashBoard/ProjectPage";

import TeamsPage from "./pages/DashBoard/TeamsPage";

import ProtectedWrapper from "./components/Wrappers/ProtectedWrapper";
import AdminWrapper from "./components/Wrappers/AdminWrapper";
import NotFoundPage from "./pages/NotFoundPage";
import ProjectDetails from "./pages/DashBoard/Projectdetails";
import AnalyticsPage from "./pages/DashBoard/AnalyticsPage";
import InviteMembers from "./pages/DashBoard/InviteMembers";
import SettingsPage from "./pages/Settings/SettingsPage";
import Members from "./pages/DashBoard/MembersPage";

const App = () => {
  const { user, token } = useSelector((state) => state.auth);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/set-password/:token" element={<SetPasswordPage />} />

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
          <Route
            path="/dashboard/members"
            element={
              <ProtectedWrapper>
                <AdminWrapper>
                  <Members />
                </AdminWrapper>
              </ProtectedWrapper>
            }
          />

          <Route path="/dashboard/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
