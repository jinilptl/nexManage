import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../services/usersOperations/usersServices";
import toast from "react-hot-toast";
import { User, Mail, Shield, CheckCircle2, Pencil } from "lucide-react";
import Avatar from "../common/Avatar";

export default function AccountSettings() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const role = user?.role === "member" ? "User" : "Administrator";
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

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
        payload: { ...user, ...formData },
      });

      toast.success("Profile updated successfully");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      toast.error(error?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="h-24 bg-linear-to-r from-blue-500 via-blue-600 to-indigo-600 relative">
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="px-6 pb-5">
          <div className="flex items-end justify-between -mt-10">
            <div className="relative">
              {user?.avatar ? (
                <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md overflow-hidden">
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md overflow-hidden">
                  <Avatar
                    user={user}
                    className="w-full h-full text-3xl rounded-none"
                  />
                </div>
              )}
            </div>
            <div className="mb-1">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${user?.role === "admin"
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}
              >
                <Shield size={11} />
                {role}
              </span>
            </div>
          </div>

          <div className="mt-3">
            <h2 className="text-lg font-bold text-gray-900 leading-tight">
              {user?.name}
            </h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="p-2 bg-blue-50 rounded-xl">
            <Pencil size={16} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Edit Profile</h3>
            <p className="text-xs text-gray-500 mt-0.5">Update your personal information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="Full Name"
              value={formData.name}
              disabled={loading}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={<User size={16} />}
              placeholder="Enter your full name"
            />

            <InputField
              label="Email Address"
              value={formData.email}
              disabled={true}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              icon={<Mail size={16} />}
              placeholder="Email address"
              hint="Email cannot be changed"
            />

            <div className="md:col-span-2">
              <InputField
                label="Role"
                value={role}
                disabled={true}
                onChange={() => { }}
                icon={<Shield size={16} />}
                placeholder="Role"
                hint="Your role is managed by an administrator"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Changes are saved to your account immediately.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex cursor-pointer items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <CheckCircle2 size={16} />
                  Saved!
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, disabled, icon, placeholder, hint }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative group">
        <div
          className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${disabled
              ? "text-gray-300"
              : "text-gray-400 group-focus-within:text-blue-500"
            }`}
        >
          {icon}
        </div>
        <input
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border outline-none transition-all duration-200 ${disabled
              ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm"
            }`}
        />
      </div>
      {hint && (
        <p className="text-xs text-gray-400 mt-1.5 ml-0.5">{hint}</p>
      )}
    </div>
  );
}
