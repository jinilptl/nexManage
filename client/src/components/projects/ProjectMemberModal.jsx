import React, { useEffect, useState } from "react";
import { X, Users, UserCog, ChevronDown, Mail, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import ButtonLoader from "../Lodders/ButtonLoader";
import { fetchAllUsers } from "../../services/usersOperations/usersServices";
import useScrollLock from "../../hooks/useScrollLock";
import Avatar from "../common/Avatar";
import {
  addProjectMemberService,
  updateProjectMemberService,
} from "../../services/projectsOperations/projectsServices";

const ROLE_OPTIONS = [
  "project-manager",
  "developer",
  "tester",
  "designer",
  "qa",
  "reviewer",
  "contributor",
];

const ROLE_COLORS = {
  "project-manager": "bg-purple-100 text-purple-700",
  developer: "bg-blue-100 text-blue-700",
  tester: "bg-orange-100 text-orange-700",
  designer: "bg-pink-100 text-pink-700",
  qa: "bg-yellow-100 text-yellow-700",
  reviewer: "bg-indigo-100 text-indigo-700",
  contributor: "bg-teal-100 text-teal-700",
};

export default function ProjectMemberModal({ open, onClose, mode = "add", member = null }) {
  useScrollLock(open);
  const dispatch = useDispatch();
  const projectId = useSelector((state) => state.projects.selectedProject.id);
  const token = useSelector((state) => state.auth.token);
  const adding = useSelector((state) => state.projects.actions.addingMember);
  const updating = useSelector((state) => state.projects.actions.updatingMember);
  const allUsers = useSelector((state) => state.users.list);
  const projectMembers = useSelector((state) => state.projects.projectMembers.list);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("contributor");

  useEffect(() => {
    if (mode === "edit" && member) {
      setEmail(member.user?.email || "");
      setRole(member.roleInProject || "contributor");
    } else {
      setEmail("");
      setRole("contributor");
    }
  }, [mode, member]);

  useEffect(() => {
    if (mode === "add" && (!allUsers || allUsers.length === 0)) {
      dispatch(fetchAllUsers(token));
    }
  }, [mode, allUsers, dispatch, token]);

  const availableUsers = allUsers?.filter(
    (u) => !projectMembers.some((pm) => pm.user?._id === u._id)
  ) || [];

  if (!open) return null;

  const isBusy = adding || updating;
  const selectedUser = allUsers?.find((u) => u.email === email);

  const handleSubmit = () => {
    if (mode === "add") {
      if (!email.trim()) return toast.error("Please select a member");
      dispatch(addProjectMemberService(projectId, { email, roleInProject: role }, token, onClose));
    } else {
      dispatch(updateProjectMemberService(projectId, member.user._id, { roleInProject: role }, token, onClose));
    }
  };

  const isAdd = mode === "add";

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isBusy && onClose()} />

      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: "92vh" }}>
        <div className={`bg-linear-to-br ${isAdd ? "from-emerald-600 via-emerald-700 to-teal-700" : "from-blue-600 via-blue-700 to-indigo-700"} px-5 py-4 shrink-0`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
                <Users size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-sm">
                  {isAdd ? "Add Member" : "Update Member Role"}
                </h2>
                <p className={`text-xs ${isAdd ? "text-emerald-200" : "text-blue-200"}`}>
                  {isAdd ? "Add an existing workspace user" : `Editing ${member?.user?.name ?? "member"}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isBusy}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer disabled:opacity-40"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-4">
          {isAdd && (
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                <Users size={13} className="text-gray-400" />
                Select Member <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  disabled={isBusy}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="">Choose a workspace member…</option>
                  {availableUsers.map((u) => (
                    <option key={u._id} value={u.email}>
                      {u.name} — {u.email}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {selectedUser && (
                <div className="mt-2 flex items-center gap-2.5 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <Avatar user={selectedUser} className="w-8 h-8 text-[11px] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{selectedUser.name}</p>
                    <p className="text-xs text-gray-500 truncate">{selectedUser.email}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {!isAdd && (
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                <Mail size={13} className="text-gray-400" />
                Member
              </label>
              <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                <Avatar user={member?.user} className="w-8 h-8 text-[11px] shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{member?.user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{email}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
              <UserCog size={13} className="text-gray-400" />
              Role in Project
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {ROLE_OPTIONS.map((r) => {
                const colorCls = ROLE_COLORS[r] ?? "bg-gray-100 text-gray-600";
                const selected = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    disabled={isBusy}
                    onClick={() => setRole(r)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer border ${selected
                        ? `${colorCls} border-current ring-1 ring-offset-1 ring-current/30`
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                      }`}
                  >
                    {r.replace(/-/g, " ")}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="shrink-0 px-5 py-4 border-t border-gray-100 bg-gray-50/60 flex justify-end gap-3">
          <button
            disabled={isBusy}
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            disabled={isBusy}
            onClick={handleSubmit}
            className={`px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-lg ${isAdd
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
              }`}
          >
            {isBusy ? (
              <><Loader2 size={14} className="animate-spin" /> Processing…</>
            ) : isAdd ? (
              <><Users size={14} /> Add Member</>
            ) : (
              <><UserCog size={14} /> Save Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
