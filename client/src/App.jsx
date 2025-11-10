import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/Homepage/HomePage'
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage'
import ResetPasswordPage from './pages/ForgotPassword/ResetPasswordPage'
import { useSelector } from 'react-redux'

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
        <Route path="/dashboard" element={<h1>{`welcome to the dashboard page ${user.name}`} </h1>} />
      </Routes>
    </div>
  )
}

export default App