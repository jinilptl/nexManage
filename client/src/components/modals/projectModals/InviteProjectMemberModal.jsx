import React, { useState, useMemo } from "react";
import {
  X,
  Mail,
  Loader2,
  UserPlus,
  Send,
  UserCheck,
  Users,
} from "lucide-react";
import useScrollLock from "../../../hooks/useScrollLock";

export default function InviteProjectMemberModal({
  isOpen,
  onClose,
  onSubmit,
  onReAdd,
  loading,
  projectMembers = [],
}) {
  useScrollLock(isOpen);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("contributor");

  const removedMatch = useMemo(() => {
    if (!email.trim()) return null;
    return projectMembers.find(
      (m) =>
        m.user?.email?.toLowerCase() === email.trim().toLowerCase() &&
        m.status === "removed"
    );
  }, [email, projectMembers]);

  const activeMatch = useMemo(() => {
    if (!email.trim()) return null;
    return projectMembers.find(
      (m) =>
        m.user?.email?.toLowerCase() === email.trim().toLowerCase() &&
        m.status === "active"
    );
  }, [email, projectMembers]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (activeMatch) {
      setError("This user is already an active member of this project");
      return;
    }

    if (removedMatch && onReAdd) {
      onReAdd(removedMatch.user?._id);
      return;
    }

    onSubmit({ email: email.trim(), roleInProject: selectedRole });
  };

  const getButtonConfig = () => {
    if (activeMatch) {
      return {
        label: "Already a Member",
        icon: UserCheck,
        className:
          "flex-1 px-4 py-2.5 bg-gray-400 text-white font-semibold rounded-xl cursor-not-allowed flex items-center justify-center gap-2",
        disabled: true,
      };
    }

    if (removedMatch) {
      return {
        label: "Re-add as Member",
        icon: UserPlus,
        className:
          "flex-1 px-4 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20",
        disabled: false,
      };
    }

    return {
      label: "Send Invitation",
      icon: Send,
      className:
        "flex-1 px-4 py-2.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20",
      disabled: false,
    };
  };

  const btnConfig = getButtonConfig();
  const BtnIcon = btnConfig.icon;

  const roleOptions = [
    {
      value: "contributor",
      label: "Member",
      icon: Users,
      description: "Full Project Access (Can edit & manage tasks)",
      hint: "Members are added with full access to create, edit, and manage tasks in the project.",
      borderColor: "border-violet-500",
      bgColor: "bg-violet-50/50",
      textColor: "text-violet-700",
      iconColor: "text-violet-600",
      ringColor: "ring-violet-500/20",
    },
  ];

  const activeRole = roleOptions.find((r) => r.value === selectedRole);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">
            Invite to Project
          </h3>

          <button
            onClick={() => onClose(false)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Email */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>

              <input
                type="email"
                id="email"
                className={`block w-full pl-10 pr-3 py-2.5 bg-gray-50 border ${
                  error ? "border-red-500" : "border-gray-200"
                } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                placeholder="example@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                disabled={loading}
              />
            </div>

            {error && (
              <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
            )}

            {email.trim() && !error && (
              <div className="mt-2.5">
                {activeMatch && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                    <UserCheck className="w-3.5 h-3.5" />
                    This user is already an active member of this project
                  </div>
                )}

                {removedMatch && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                    <UserPlus className="w-3.5 h-3.5" />
                    This user already has an account — you can add them directly
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Role */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>

            <div className="grid grid-cols-1 gap-3">
              {roleOptions.map((role) => {
                const RoleIcon = role.icon;
                const isSelected = selectedRole === role.value;

                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? `${role.borderColor} ${role.bgColor} ${role.textColor} shadow-sm ring-2 ${role.ringColor}`
                        : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <RoleIcon
                      className={`w-6 h-6 mb-2 ${
                        isSelected ? role.iconColor : "text-gray-400"
                      }`}
                    />

                    <span className="text-sm font-semibold">
                      {role.label}
                    </span>

                    <span className="text-[10px] mt-1 text-center leading-tight opacity-70">
                      {role.description}
                    </span>
                  </button>
                );
              })}
            </div>

            {activeRole && (
              <p className="mt-3 text-[11px] text-gray-500 leading-relaxed italic">
                {activeRole.hint}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || btnConfig.disabled}
              className={btnConfig.className}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {removedMatch ? "Re-adding..." : "Sending..."}
                </>
              ) : (
                <>
                  <BtnIcon className="w-4 h-4" />
                  {btnConfig.label}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}