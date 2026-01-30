import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import SettingsCard from "./SettingsCard";
import SettingToggle from "./SettingToggle";

export default function SecuritySettings() {
  const [twoFA, setTwoFA] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

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

    // remove error when user starts typing
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
      newErrors.newPassword = "New password must be different from current password";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdatePassword = () => {
    const isValid = validatePassword();
    if (!isValid) return;
console.log("password object --> ",password.currentPassword,password.newPassword);

    // Dummy success
    alert("Password Updated 🔒 (Dummy)");


    setPassword({
      currentPassword: "",
      newPassword: "",      
      
    });

    
    setShowPassword({
      currentPassword: false,
      newPassword: false,
    });
  };

  return (
    <SettingsCard
      title="Security"
      subtitle="Protect your account with extra security options"
    >
      <SettingToggle
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
      />

      {/* Change Password */}
      <div className="border border-gray-200 rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Change Password</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Password */}
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                {showPassword.currentPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {errors.currentPassword && (
              <p className="text-xs text-red-600 mt-1">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                {showPassword.newPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.newPassword && (
              <p className="text-xs text-red-600 mt-1">{errors.newPassword}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleUpdatePassword}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition"
        >
          Update Password
        </button>
      </div>
    </SettingsCard>
  );
}
