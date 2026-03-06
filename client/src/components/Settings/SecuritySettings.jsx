import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Info,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { updatePassword } from "../../services/usersOperations/usersServices";

export default function SecuritySettings() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

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
    setPassword((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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

  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1)
      return { label: "Weak", color: "bg-red-400", width: "w-1/4" };
    if (score === 2)
      return { label: "Fair", color: "bg-orange-400", width: "w-2/4" };
    if (score === 3)
      return { label: "Good", color: "bg-yellow-400", width: "w-3/4" };
    return { label: "Strong", color: "bg-green-500", width: "w-full" };
  };

  const strength = getPasswordStrength(password.newPassword);

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
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);

      setPassword({ currentPassword: "", newPassword: "" });
      setShowPassword({ currentPassword: false, newPassword: false });
    } catch (error) {
      toast.error(error?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="h-24 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-600 relative">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="px-6 pb-5 mt-2">
          <div className="flex items-end justify-between -mt-9">
            <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-md bg-emerald-50 flex items-center justify-center z-50">
              <ShieldCheck size={28} className="text-emerald-600" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 self-end mt-5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Account Secured
            </span>
          </div>
          <div className="mt-3">
            <h2 className="text-lg font-bold text-gray-900 leading-tight">
              Security Settings
            </h2>
            <p className="text-sm text-gray-500">
              Keep your account safe with a strong password
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="p-2 bg-emerald-50 rounded-xl">
            <Lock size={16} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Change Password
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Update your password to keep your account secure
            </p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <Info size={15} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              Use a strong password with uppercase letters, numbers, and
              symbols. Never share your password with anyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <PasswordField
              label="Current Password"
              name="currentPassword"
              value={password.currentPassword}
              show={showPassword.currentPassword}
              onToggleShow={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  currentPassword: !prev.currentPassword,
                }))
              }
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter current password"
              icon={<KeyRound size={16} />}
              error={errors.currentPassword}
            />

            <PasswordField
              label="New Password"
              name="newPassword"
              value={password.newPassword}
              show={showPassword.newPassword}
              onToggleShow={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  newPassword: !prev.newPassword,
                }))
              }
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter new password"
              icon={<Lock size={16} />}
              error={errors.newPassword}
            />
          </div>

          {password.newPassword && strength && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 font-medium">
                  Password strength
                </p>
                <span
                  className={`text-xs font-semibold ${
                    strength.label === "Weak"
                      ? "text-red-500"
                      : strength.label === "Fair"
                        ? "text-orange-500"
                        : strength.label === "Good"
                          ? "text-yellow-600"
                          : "text-green-600"
                  }`}
                >
                  {strength.label}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.width}`}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              You'll remain logged in after updating your password.
            </p>
            <button
              onClick={handleUpdatePassword}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 active:scale-95 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : saved ? (
                <>
                  <CheckCircle2 size={16} />
                  Updated!
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  name,
  value,
  show,
  onToggleShow,
  onChange,
  disabled,
  placeholder,
  icon,
  error,
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative group">
        <div
          className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${
            error
              ? "text-red-400"
              : "text-gray-400 group-focus-within:text-emerald-500"
          }`}
        >
          {icon}
        </div>
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border outline-none transition-all duration-200 bg-white shadow-sm ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-gray-900"
              : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-gray-900"
          } disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed`}
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5"
          tabIndex={-1}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1.5 ml-0.5 font-medium flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
}
