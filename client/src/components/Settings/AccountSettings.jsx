import { useEffect, useState } from "react";
import SettingsCard from "./SettingsCard";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../services/usersOperations/usersServices";
import toast from "react-hot-toast";
import { User, Mail, Shield } from "lucide-react";
import Avatar from "../common/Avatar";

export default function AccountSettings() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const role = user?.role === "member" ? "User" : "Administrator";
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.name === user.name && formData.email === user.email) {
      toast("No changes to update");
      setIsEditing(false);
      return;
    }

    try {
      setLoading(true);

      await dispatch(
        updateUser({
          userId: user._id,
          data: formData,
          token,
        }),
      ).unwrap();

      dispatch({
        type: "auth/setUser",
        payload: {
          ...user,
          ...formData,
        },
      });

      toast.success("User updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error(error?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            {user?.avatar ? (
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-sm overflow-hidden">
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
            ) : (
              <Avatar user={user} className="w-20 h-20 text-3xl border-4 border-white shadow-sm" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="inline-block mt-2 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
              {role}
            </span>
          </div>
        </div>
        <div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <SettingsCard title="Personal Information" subtitle="Manage your personal details">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Full Name"
              value={formData.name}
              disabled={!isEditing || loading}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={<User size={18} />}
            />

            <InputField
              label="Email Address"
              value={formData.email}
              disabled={true}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              icon={<Mail size={18} />}
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Shield size={18} />
                </div>
                <input
                  value={role}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed font-medium"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5 ml-1">
                Your role determines your permissions within the workspace. Contact an admin to change this.
              </p>
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user.name,
                    email: user.email,
                  });
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </form>
      </SettingsCard>
    </div>
  );
}

function InputField({ label, value, onChange, disabled, icon }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">{label}</label>
      <div className="relative group">
        <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${disabled ? "text-gray-400" : "text-gray-500 group-focus-within:text-blue-600"}`}>
          {icon}
        </div>
        <input
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border outline-none transition-all duration-200
            ${disabled
              ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed shadow-none"
              : "bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm"
            }`}
          placeholder={`Enter ${label}`}
        />
      </div>
    </div>
  );
}
