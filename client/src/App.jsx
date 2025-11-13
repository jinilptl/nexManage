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

const App = () => {

  const {user,token}=useSelector((state)=>state.auth)

  console.log("-------- user in app --------",user.name);
  console.log("-------- token in app ---------",token.slice(0,35)+"...");
  
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage/>} />
         <Route path='/dashboard' element={<DashboardPage/>}>
         
            <Route index element={<Dashboard />} />
            <Route path='/dashboard/teams' element={<TeamsPage />} />
         
         
         
         </Route>
      </Routes>
    </div>
  )
}

export default App