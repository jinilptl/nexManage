import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Mail,
  UserPlus,
  Shield,
  Users,
  MailCheck,
  CheckCircle2,
  Send,
  Clock,
  KeyRound,
} from "lucide-react";
import toast from "react-hot-toast";
import { inviteMemberService } from "../../services/authOperations/authServices";
import { useNavigate } from "react-router-dom";

const InviteMembers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const loading = useSelector((state) => state.auth.Authloading);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  useEffect(() => {
    document.title = "Invite Members | NexManage";
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      toast.error("Name and email are required");
      return;
    }

    try {
      const success = await dispatch(
        inviteMemberService({ name, email, role }, token),
      );
      if (success) {
        setName("");
        setEmail("");
        setRole("member");
      }
    } catch (error) {}
  };

  return (
    <div className="pt-5 px-4 md:px-2 pb-10 space-y-6">
      <div>
        <h1 className="text-gray-900 text-2xl font-bold">Invite New Member</h1>
        <p className="text-gray-600">
          Send a secure invitation link — the member will set their own
          password.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8">
              <form onSubmit={handleInvite} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserPlus className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Sarah Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Assign Role
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="block w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      placeholder="e.g. sarah@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <MailCheck className="w-4 h-4" />
                    {loading ? "Sending..." : "Send Invitation"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              How It Works
            </h3>

            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-gray-600">
                <div className="mt-0.5 min-w-5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                    1
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Enter Details</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Fill in the member's name, email, and assign a role.
                  </p>
                </div>
              </li>
              <li className="flex gap-3 text-sm text-gray-600">
                <div className="mt-0.5 min-w-5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                    2
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" /> Secure Link Sent
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    A secure invitation link is emailed — no passwords are
                    shared.
                  </p>
                </div>
              </li>
              <li className="flex gap-3 text-sm text-gray-600">
                <div className="mt-0.5 min-w-5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                    3
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" /> User Sets Password
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    The user clicks the link and creates their own password.
                  </p>
                </div>
              </li>
              <li className="flex gap-3 text-sm text-gray-600">
                <div className="mt-0.5 min-w-5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-600 text-xs font-bold">
                    <Clock className="w-3 h-3" />
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Link Expires</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    The link expires in 24 hours and can only be used once.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Role Permissions
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-900 text-sm">
                    Member
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Can view and work on assigned projects and tasks. Limited
                  access to settings.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-900 text-sm">
                    Admin
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Full access to project settings, team management, and user
                  roles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteMembers;
