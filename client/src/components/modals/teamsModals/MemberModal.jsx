import React, { useEffect, useState } from "react";
import { X, Users, UserCog, ChevronDown, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTeamMemberService,
  updateTeamMemberService,
} from "../../../services/teamsOperations/teamsServices";
import { fetchAllUsers } from "../../../services/usersOperations/usersServices";
import ButtonLoader from "../../Lodders/ButtonLoader";
import useScrollLock from "../../../hooks/useScrollLock";
import Avatar from "../../common/Avatar";

const ROLE_OPTIONS = ["team lead", "developer", "tester", "manager", "designer", "QA", "member"];

const ROLE_COLORS = {
  "team lead": "bg-purple-100 text-purple-700",
  developer: "bg-blue-100 text-blue-700",
  tester: "bg-orange-100 text-orange-700",
  manager: "bg-indigo-100 text-indigo-700",
  designer: "bg-pink-100 text-pink-700",
  QA: "bg-yellow-100 text-yellow-700",
  member: "bg-gray-100 text-gray-600",
};

export default function MemberModal({ open, mode = "add", onClose, member, setMember }) {
  const dispatch = useDispatch();
  const selectedTeamId = useSelector((state) => state.teams.selectedTeam.id);
  const token = useSelector((state) => state.auth.token);
  const adding = useSelector((state) => state.teams.actions.addingMember);
  const updating = useSelector((state) => state.teams.actions.updatingMember);
  const allUsers = useSelector((state) => state.users.list);
  const teamMembers = useSelector((state) => state.teams.teamMembers.list);
  const loading = mode === "add" ? adding : updating;

  useEffect(() => {
    if (mode === "add" && (!allUsers || allUsers.length === 0) && open) {
      dispatch(fetchAllUsers(token));
    }
  }, [mode, allUsers, dispatch, token, open]);

  const [inputValue, setInputValue] = useState({ email: "", roleInTeam: "member", status: "active" });

  useEffect(() => {
    if (mode === "update" && member) {
      setInputValue({ email: member.user?.email || "", roleInTeam: member.roleInTeam, status: member.status });
    }
  }, [mode, member]);

  const handleChange = (e) => setInputValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    if (mode === "add") dispatch(addTeamMemberService(selectedTeamId, inputValue, token, onClose));
    if (mode === "update") dispatch(updateTeamMemberService(selectedTeamId, member.user._id, { roleInTeam: inputValue.roleInTeam, status: inputValue.status }, token, onClose, setMember));
  };

  useScrollLock(open);
  if (!open || !selectedTeamId) return null;

  const availableUsers = allUsers?.filter((u) => !teamMembers.some((tm) => tm.user?._id === u._id)) || [];
  const selectedUser = allUsers?.find((u) => u.email === inputValue.email);
  const isAdd = mode === "add";

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !loading && onClose(false)} />

      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: "92vh" }}>
        <div className={`bg-linear-to-br ${isAdd ? "from-emerald-600 via-emerald-700 to-teal-700" : "from-blue-600 via-blue-700 to-indigo-700"} px-5 py-4 shrink-0`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
                <Users size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-sm">
                  {isAdd ? "Add Team Member" : "Update Member"}
                </h2>
                <p className={`text-xs ${isAdd ? "text-emerald-200" : "text-blue-200"}`}>
                  {isAdd ? "Add a member to this team" : `Editing ${member?.user?.name ?? "member"}`}
                </p>
              </div>
            </div>
            <button
              disabled={loading}
              onClick={() => !loading && onClose(false)}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer disabled:opacity-40"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <form className="overflow-y-auto flex-1 px-5 py-5 space-y-4" onSubmit={handleSubmit}>
          {isAdd && (
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                <Users size={13} className="text-gray-400" />
                Select Member <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="email"
                  value={inputValue.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="">Choose a workspace member…</option>
                  {availableUsers.map((u) => (
                    <option key={u._id} value={u.email}>{u.name} — {u.email}</option>
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
            <div className="flex items-center gap-2.5 p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <Avatar user={member?.user} className="w-9 h-9 text-[11px] shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800">{member?.user?.name}</p>
                <p className="text-xs text-gray-400">{inputValue.email}</p>
              </div>
            </div>
          )}

          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
              <UserCog size={13} className="text-gray-400" />
              Role in Team
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {ROLE_OPTIONS.map((r) => {
                const colorCls = ROLE_COLORS[r] ?? "bg-gray-100 text-gray-600";
                const selected = inputValue.roleInTeam === r;
                return (
                  <button
                    key={r}
                    type="button"
                    disabled={loading}
                    onClick={() => setInputValue((p) => ({ ...p, roleInTeam: r }))}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer border ${selected
                        ? `${colorCls} border-current ring-1 ring-offset-1 ring-current/30`
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                      }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          {!isAdd && (
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Member Status</label>
              <div className="flex gap-2">
                {["active", "inactive"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={loading}
                    onClick={() => setInputValue((p) => ({ ...p, status: s }))}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${inputValue.status === s
                        ? s === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                          : "bg-red-50 text-red-700 border-red-300"
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>

        <div className="shrink-0 px-5 py-4 border-t border-gray-100 bg-gray-50/60 flex justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => !loading && onClose(false)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className={`px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-lg ${isAdd
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
              }`}
          >
            {loading ? (
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
