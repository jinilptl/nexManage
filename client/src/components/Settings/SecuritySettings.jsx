import React, { useState } from "react";
import { Eye, EyeOff, Lock, KeyRound, ShieldCheck, Smartphone, Bell, AlertTriangle } from "lucide-react";
import SettingsCard from "./SettingsCard";
import SettingToggle from "./SettingToggle";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { updatePassword } from "../../services/usersOperations/usersServices";

export default function SecuritySettings() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);


  const [twoFA, setTwoFA] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validatePassword = () => {
    let newErrors = { currentPassword: "", newPassword: "" };
    let isValid = true;

    if (!password.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
      isValid = false;
    }

    if (!password.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (password.newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters";
      isValid = false;
    } else if (password.currentPassword === password.newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdatePassword = async () => {
    const isValid = validatePassword();
    if (!isValid) return;

    try {
      setLoading(true);

      await dispatch(
        updatePassword({
          currentPassword: password.currentPassword,
          newPassword: password.newPassword,
          token,
        }),
      ).unwrap();

      toast.success("Password updated successfully");

      setPassword({
        currentPassword: "",
        newPassword: "",
      });

      setShowPassword({
        currentPassword: false,
        newPassword: false,
      });
    } catch (error) {
      toast.error(error?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Features */}
      {/* <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ShieldCheck className="text-blue-600" size={20} />
          Authentication & Alerts
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <SettingToggle
            title="Two-Factor Authentication"
            desc="Add an extra layer of security to your account by requiring a code."
            enabled={twoFA}
            onToggle={() => {
              setTwoFA(!twoFA);
              toast.success(twoFA ? "Two-Factor Authentication disabled" : "Two-Factor Authentication enabled");
            }}
            icon={<Smartphone size={20} />}
          />

          <SettingToggle
            title="Login Notifications"
            desc="Receive an email when someone logs into your account from an unrecognized device."
            enabled={loginAlerts}
            onToggle={() => {
              setLoginAlerts(!loginAlerts);
              toast.success(loginAlerts ? "Login alerts disabled" : "Login alerts enabled");
            }}
            icon={<Bell size={20} />}
          />
        </div>
      </div> */}

      {/* Password Update */}
      <SettingsCard
        title="Password Management"
        subtitle="Manage your password regularly to keep your account secure."
      >
        <div className="border border-blue-100 bg-blue-50/50 rounded-lg p-4 mb-6 flex gap-3 text-blue-800">
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm">Never share your password with anyone. Use a strong password containing letters, numbers, and symbols.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
              Current Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <KeyRound size={18} />
              </div>
              <input
                type={showPassword.currentPassword ? "text" : "password"}
                name="currentPassword"
                value={password.currentPassword}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter current password"
                className={`w-full bg-white border rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none transition-all duration-200
                  ${errors.currentPassword
                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  }`}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    currentPassword: !prev.currentPassword,
                  }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword.currentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-xs text-red-600 mt-1.5 ml-1 font-medium flex items-center gap-1">
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
              New Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword.newPassword ? "text" : "password"}
                name="newPassword"
                value={password.newPassword}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter new password"
                className={`w-full bg-white border rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none transition-all duration-200
                  ${errors.newPassword
                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  }`}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    newPassword: !prev.newPassword,
                  }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword.newPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-red-600 mt-1.5 ml-1 font-medium flex items-center gap-1">
                {errors.newPassword}
              </p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleUpdatePassword}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </SettingsCard>
    </div>
  );
}
