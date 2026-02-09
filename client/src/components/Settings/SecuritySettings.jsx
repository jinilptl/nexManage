import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import SettingsCard from "./SettingsCard";
import SettingToggle from "./SettingToggle";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { updatePassword } from "../../services/usersOperations/usersServices";

export default function SecuritySettings() {
  const dispatch = useDispatch();

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
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsCard
      title="Security"
      subtitle="Protect your account with extra security options"
    >
      {/* <SettingToggle
        title="Enable Two-Factor Authentication (2FA)"
        desc="Add extra security by verifying login with OTP"
        enabled={twoFA}
        onToggle={() => setTwoFA((p) => !p)}
      />

      <SettingToggle
        title="Login Alerts"
        desc="Get notified when someone logs into your account"
        enabled={loginAlerts}
        onToggle={() => setLoginAlerts((p) => !p)}
      /> */}

      <div className="border border-gray-200 rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Change Password</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Current Password
            </label>

            <div className="relative mt-1">
              <input
                type={showPassword.currentPassword ? "text" : "password"}
                name="currentPassword"
                value={password.currentPassword}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter current password"
                className={`w-full border rounded-lg px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.currentPassword ? "border-red-500" : "border-gray-300"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword.currentPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {errors.currentPassword && (
              <p className="text-xs text-red-600 mt-1">
                {errors.currentPassword}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>

            <div className="relative mt-1">
              <input
                type={showPassword.newPassword ? "text" : "password"}
                name="newPassword"
                value={password.newPassword}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter new password"
                className={`w-full border rounded-lg px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword.newPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {errors.newPassword && (
              <p className="text-xs text-red-600 mt-1">{errors.newPassword}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleUpdatePassword}
          disabled={loading}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium
                     hover:bg-black transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </SettingsCard>
  );
}
