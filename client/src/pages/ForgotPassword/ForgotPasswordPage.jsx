import React, { useState } from "react";
import { FolderKanban } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordService } from "../../services/authOperations/authServices";

export default function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const{loading}=useSelector((state)=>state.auth)

  const [email,setEmail]=useState("")

  const handleSubmit=(e)=>{
    e.preventDefault();

    
     dispatch(forgotPasswordService(email))
    
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-6 space-y-6">

        {/* NexManage Icon + Name */}
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <FolderKanban className="w-7 h-7 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">NexManage</span>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Forgot Password</h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter your email to receive a reset link
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Email */}
          <div>
            <label className="text-sm font-medium block mb-1">Email</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e)=>{setEmail(e.target.value)}}
              className="w-full border rounded-lg p-3 text-sm focus:ring-blue-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className={`w-full h-12 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center ${loading?"cursor-not-allowed opacity-70":"cursor-pointer"}`}
            disabled={loading}
          >
           {loading?"Loading...":"Send Reset Link"}
          </button>

          <p className="text-sm text-gray-600 text-center pt-4 border-t">
            Back to{" "}
            <Link to="/login" className="text-blue-600 font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
