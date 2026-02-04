import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Mail,
  UserPlus,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Users,
  MailCheck,
} from "lucide-react";
import toast from "react-hot-toast";

const InviteMembers = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("contributor");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInvite = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      // 🔥 API / Redux call
      // await dispatch(inviteMember({ email, password, role })).unwrap();

      toast.success("Invitation sent successfully!");
      setEmail("");
      setPassword("");
      setRole("contributor");
    } catch (error) {
      toast.error(error?.message || "Failed to invite member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= LEFT : FORM ================= */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-md border border-gray-300">
            {/* Header */}
            <div className="p-6 border-b border-gray-300">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-600/10 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Invite Member
                  </h2>
                  <p className="text-sm text-gray-500">
                    Add a new user to your workspace
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleInvite} className="p-6 space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 text-sm focus:ring-2  focus:border-gray-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temporary Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 pl-10 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="contributor">Contributor</option>
                  <option value="project-manager">Project Manager</option>
                </select>
              </div>

              {/* Action */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                <UserPlus className="w-4 h-4" />
                {loading ? "Sending invite..." : "Send Invitation"}
              </button>
            </form>
          </div>
        </div>

        {/* ================= RIGHT : INFO PANEL ================= */}
        <div className="bg-white rounded-2xl border border-gray-300 shadow-sm p-6 space-y-6 h-fit sticky top-6">
          <h3 className="text-lg font-semibold text-gray-900">
            How invitations work
          </h3>

          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex gap-3">
              <MailCheck className="w-5 h-5 text-blue-600" />
              <p>
                An invitation email will be sent with login credentials.
              </p>
            </div>

            <div className="flex gap-3">
              <Users className="w-5 h-5 text-blue-600" />
              <p>
                Members can access projects based on their assigned role.
              </p>
            </div>

            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <p>
                Roles control permissions across the workspace.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
            💡 Tip: You can update member roles anytime from the Teams page.
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteMembers;
