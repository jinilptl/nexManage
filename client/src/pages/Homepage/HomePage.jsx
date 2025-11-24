import React, { useState } from "react";
import { FolderKanban, Loader2, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUserService } from "../../services/authOperations/authServices";


const HomePage = () => {
  const {loading}= useSelector((state)=>state.auth)
  
  const dispatch=useDispatch();
  const navigate=useNavigate()
 
 
  const [showPassword, setShowPassword] = useState(false);
  const[email,setEmail]=useState("");
  const [password, setPassword] = useState("");

  const submitHandler=(e)=>{
    e.preventDefault();
    
   dispatch( loginUserService(email,password,navigate))
   setEmail("");
   setPassword("")
  }

  
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex">

      {/* Left Side - Branding (unchanged content) */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-600 to-purple-600 p-12 flex-col justify-between text-white">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FolderKanban className="w-7 h-7" />
            </div>
            <span className="text-2xl">NexManage</span>
          </div>
          <h1 className="text-4xl mb-4">
            Streamline Your
            <br />
            Project Management
          </h1>
          <p className="text-blue-100 text-lg">
            Collaborate with your team, track progress, and deliver projects on time with our
            comprehensive project management platform.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg mb-1">Real-time Collaboration</h3>
              <p className="text-blue-100 text-sm">
                Work together seamlessly with live updates and instant notifications
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg mb-1">Powerful Analytics</h3>
              <p className="text-blue-100 text-sm">
                Track team performance and project metrics with detailed insights
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg mb-1">Enterprise Security</h3>
              <p className="text-blue-100 text-sm">
                Role-based access control and audit logs keep your data secure
              </p>
            </div>
          </div>
        </div>

        <p className="text-blue-100 text-sm">
          © 2025 NexManage. All rights reserved.
        </p>
      </div>

      {/* Right Side Login */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md shadow-xl bg-white rounded-xl p-6 space-y-6">

          {/* Logo on mobile */}
          <div className="flex justify-center mb-4 lg:hidden">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <FolderKanban className="w-7 h-7 text-white" />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold">Welcome back</h2>
            <p className="text-gray-500 text-sm">Sign in to your NexManage account</p>
          </div>

          <form className="space-y-4"  onSubmit={submitHandler}>

            {/* Email */}
            <div>
              <label className="text-sm font-medium block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e)=>{setEmail(e.target.value)}}
                placeholder="you@company.com"
                className="w-full border rounded-lg p-3 text-sm focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium">Password</label>
               
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e)=>{setPassword(e.target.value)}}
                  placeholder="enter your password"
                  className="w-full border rounded-lg p-3 text-sm pr-10"
                  autoComplete="password"
                  minLength={6}
                  maxLength={20}
                  required
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
               
               <div>
                <Link to={'/forgot-password'} className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </Link>
               </div>
            </div>

            

            {/* Remember me */}
            <div className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="h-4 w-4" />
              <span>Remember me</span>
            </div>

            {/* Button */}
            <button type="submit" className={`w-full h-12 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center ${loading ? "cursor-not-allowed opacity-70" : ""}`} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-sm text-gray-600 text-center pt-4 border-t">
              Don't have an account? <span className="text-gray-900 font-medium">Contact your administrator</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePage