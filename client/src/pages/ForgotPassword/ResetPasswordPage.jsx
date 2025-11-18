import React, { useState } from "react";
import { FolderKanban, Eye, EyeOff } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordService } from "../../services/authOperations/authServices";

export default function ResetPasswordPage() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { token } = useParams();

  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("pasword and confirm password do not match");
      return;
    }

    dispatch(resetPasswordService(newPassword, token));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-6 space-y-6">
        {/* App Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <FolderKanban className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Reset Password</h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter your new password below
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* New Password */}
          <div>
            <label className="text-sm font-medium block mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                className="w-full border rounded-lg p-3 text-sm pr-10"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium block mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                className="w-full border rounded-lg p-3 text-sm pr-10"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                autoComplete="confirmPassword"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full h-12 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center ${
              loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
            }`}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {/* Back to login */}
          <p className="text-sm text-gray-600 text-center pt-4 border-t">
            Back to{" "}
            <Link to="/" className="text-blue-600 font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
