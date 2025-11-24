
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/Homepage/HomePage'
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage'
import ResetPasswordPage from './pages/ForgotPassword/ResetPasswordPage'
import { useSelector } from 'react-redux'
import Navigation from './components/Navigation'
import Dashboard from './components/Dashboard'
import DashboardPage from './pages/DashBoard/DashboardPage'
import TeamsPage from './pages/DashBoard/TeamsPage'
import ProjectPage from './pages/DashBoard/ProjectPage'


import Dashboard from "./components/Dashboard";
import DashboardPage from "./pages/DashBoard/DashboardPage";
import TeamsPage from "./pages/DashBoard/TeamsPage";

import ProtectedWrapper from "./components/Wrappers/ProtectedWrapper";
import NotFoundPage from "./pages/NotFoundPage";

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
          <Route path='/dashboard/project' element={<ProjectPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;
