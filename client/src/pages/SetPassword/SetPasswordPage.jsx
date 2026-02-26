import React, { useState, useEffect } from "react";
import { FolderKanban, Eye, EyeOff, CheckCircle, Shield } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { setPasswordService } from "../../services/authOperations/authServices";

export default function SetPasswordPage() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = "Set Password | NexManage";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return;
    }

    if (password.length < 6) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    setLoading(true);

    try {
      const result = await setPasswordService(token, password);
      if (result) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const passwordTooShort = password.length > 0 && password.length < 6;
  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  if (success) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-9 h-9 text-green-600" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Password Set Successfully!
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Your account is now active. Redirecting you to the login page...
            </p>
          </div>
          <Link
            to="/"
            className="inline-block w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-6 space-y-6">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <FolderKanban className="w-7 h-7 text-white" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold">Set Your Password</h2>
          <p className="text-gray-500 text-sm mt-1">
            Welcome to NexManage! Create a secure password to activate your
            account.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
          <Shield className="w-4 h-4 text-blue-600 shrink-0" />
          <p className="text-xs text-blue-700">
            This is a one-time secure link. It will expire after use.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full border rounded-lg p-3 text-sm pr-10 transition-colors ${
                  passwordTooShort
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {passwordTooShort && (
              <p className="text-xs text-red-500 mt-1">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full border rounded-lg p-3 text-sm pr-10 transition-colors ${
                  passwordMismatch
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {passwordMismatch && (
              <p className="text-xs text-red-500 mt-1">
                Passwords do not match
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full h-12 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center transition-colors ${
              loading || passwordTooShort || passwordMismatch
                ? "cursor-not-allowed opacity-70"
                : "cursor-pointer"
            }`}
            disabled={loading || passwordTooShort || passwordMismatch}
          >
            {loading
              ? "Setting Password..."
              : "Set Password & Activate Account"}
          </button>

          <p className="text-sm text-gray-600 text-center pt-4 border-t">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
