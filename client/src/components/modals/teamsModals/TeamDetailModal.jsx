import React, { useState } from "react";
import {
  X, Edit, Trash2, UserPlus, Crown, Users,
  Calendar, Loader2, AlertTriangle, Shield,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedTeamData,
  setSelectedTeamId,
} from "../../../Redux_Config/Slices/teamsSlice";
import {
  deleteTeamService,
  fetchSingleTeamService,
  removeTeamMemberService,
} from "../../../services/teamsOperations/teamsServices";
import CreateTeamModal from "./CreateTeamModal";
import MemberModal from "./MemberModal";
import ModalSmallLoader from "../../Lodders/ModalSmallLoader";
import ConfirmModal from "./ConfirmModal";
import useScrollLock from "../../../hooks/useScrollLock";
import Avatar from "../../common/Avatar";

const ROLE_COLORS = {
  "team lead": "bg-purple-100 text-purple-700 border-purple-200",
  developer: "bg-blue-100 text-blue-700 border-blue-200",
  tester: "bg-orange-100 text-orange-700 border-orange-200",
  manager: "bg-indigo-100 text-indigo-700 border-indigo-200",
  designer: "bg-pink-100 text-pink-700 border-pink-200",
  qa: "bg-yellow-100 text-yellow-700 border-yellow-200",
  member: "bg-gray-100 text-gray-600 border-gray-200",
};
const getRoleCls = (r = "") => ROLE_COLORS[(r || "").toLowerCase()] ?? "bg-gray-100 text-gray-600 border-gray-200";

const GRADIENTS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-sky-600",
];
const getGradient = (name = "") => GRADIENTS[name.charCodeAt(0) % GRADIENTS.length];

export default function TeamDetailModal({ open, onClose }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.user.role);

  const deleting = useSelector((state) => state.teams.actions.deletingTeam);
  const updating = useSelector((state) => state.teams.actions.updatingTeam);
  const addingMember = useSelector((state) => state.teams.actions.addingMember);
  const updatingMember = useSelector((state) => state.teams.actions.updatingMember);
  const removingMember = useSelector((state) => state.teams.actions.removingMember);
  const fetchLoading = useSelector((state) => state.teams.selectedTeam.loading);
  const membersLoading = useSelector((state) => state.teams.teamMembers.loading);

  const teamId = useSelector((state) => state.teams.selectedTeam.id);
  const team = useSelector((state) => state.teams.selectedTeam.data);
  const members = useSelector((state) => state.teams.teamMembers.list);

  const isAdmin = role === "admin" || role === "super_admin";

  const [modalOpen, setModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [memberModalMode, setMemberModalMode] = useState("add");
  const [selectedMember, setSelectedMember] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  const closeAndReset = () => {
    onClose();
    dispatch(setSelectedTeamData(null));
    dispatch(setSelectedTeamId(null));
  };

  const handleDeleteTeam = () => { setConfirmType("deleteTeam"); setConfirmOpen(true); };
  const handleRemoveMember = (id) => { setConfirmType("removeMember"); setSelectedMemberId(id); setConfirmOpen(true); };

  const handleConfirmAction = () => {
    if (confirmType === "deleteTeam") {
      dispatch(deleteTeamService(teamId, token));
      closeAndReset();
    }
    if (confirmType === "removeMember") {
      dispatch(removeTeamMemberService(teamId, selectedMemberId, token));
    }
    setConfirmOpen(false);
    setConfirmType(null);
    setSelectedMemberId(null);
  };

  useScrollLock(open);
  if (!open) return null;

  const gradient = getGradient(team?.teamName || "");
  const initial = (team?.teamName || "T")[0].toUpperCase();
  const isActive = (team?.status || "").toUpperCase() === "ACTIVE";

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => { if (!updating && !deleting) closeAndReset(); }}
      />

      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: "92vh" }}>
        {/* Loading overlay */}
        {(fetchLoading || membersLoading) && (
          <div className="absolute inset-0 z-50 bg-white/70 flex items-center justify-center rounded-2xl">
            <ModalSmallLoader />
          </div>
        )}

        {/* Gradient Hero Header */}
        <div className={`bg-linear-to-br ${gradient} px-6 py-5 shrink-0`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-4">
              {/* Team icon */}
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shadow-md shrink-0">
                <span className="text-2xl font-black text-white">{initial}</span>
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-black text-white leading-tight line-clamp-1">
                  {team?.teamName}
                </h2>
                <p className="text-white/70 text-sm mt-0.5 line-clamp-1">
                  {team?.description || "No description"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${isActive ? "bg-white/25 text-white" : "bg-black/20 text-white/80"
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-300" : "bg-gray-400"}`} />
                    {isActive ? "Active" : "Archived"}
                  </span>
                  <span className="text-white/60 text-[11px] flex items-center gap-1">
                    <Users size={11} />
                    {members?.length || 0} member{members?.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Close */}
            <button
              disabled={updating || deleting}
              onClick={closeAndReset}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer disabled:opacity-40 shrink-0 mt-0.5"
            >
              <X size={18} />
            </button>
          </div>

          {/* Admin actions row */}
          {isAdmin && (
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                disabled={updating}
                onClick={() => { setModalOpen(true); dispatch(fetchSingleTeamService(teamId, token)); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-blue-700 hover:bg-blue-50 text-xs font-semibold rounded-lg transition-all cursor-pointer disabled:opacity-50 active:scale-95 shadow-sm"
              >
                {updating ? <Loader2 size={12} className="animate-spin" /> : <Edit size={12} />}
                {updating ? "Saving…" : "Edit Team"}
              </button>
              <button
                disabled={deleting}
                onClick={handleDeleteTeam}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer disabled:opacity-50 active:scale-95 shadow-sm"
              >
                {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                {deleting ? "Deleting…" : "Delete Team"}
              </button>
            </div>
          )}
        </div>

        {/* Body — Members list */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-gray-500" />
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Members</h3>
              <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">
                {members?.length || 0}
              </span>
            </div>
            {isAdmin && (
              <button
                disabled={addingMember}
                onClick={() => { setMemberModalMode("add"); setMemberModalOpen(true); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer disabled:opacity-50 shadow-sm active:scale-95"
              >
                {addingMember ? <Loader2 size={12} className="animate-spin" /> : <UserPlus size={12} />}
                {addingMember ? "Adding…" : "Add Member"}
              </button>
            )}
          </div>

          {/* Empty state */}
          {(!members || members.length === 0) && (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                <Users size={20} className="text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-500">No members yet</p>
              <p className="text-xs text-gray-400 mt-1">Add your first team member to get started</p>
            </div>
          )}

          {/* Member cards */}
          <div className="space-y-2">
            {members?.map((m) => {
              const isLead = (m.roleInTeam || "").toLowerCase() === "team lead";
              return (
                <div
                  key={m.user?._id}
                  className="group flex items-center justify-between gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  {/* Left: avatar + name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <Avatar user={m.user} className="w-9 h-9 text-[12px] shadow-sm" />
                      {isLead && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center ring-1 ring-white">
                          <Crown size={8} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{m.user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{m.user?.email}</p>
                    </div>
                  </div>

                  {/* Right: role badge + actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${getRoleCls(m.roleInTeam)}`}>
                      {m.roleInTeam}
                    </span>

                    {/* Status dot */}
                    <span className={`w-2 h-2 rounded-full ${m.status === "active" ? "bg-emerald-500" : "bg-gray-300"}`} title={m.status} />

                    {isAdmin && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          disabled={updatingMember}
                          onClick={() => { setSelectedMember(m); setMemberModalMode("update"); setMemberModalOpen(true); }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-40"
                          title="Edit member"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          disabled={removingMember}
                          onClick={() => handleRemoveMember(m.user._id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-40"
                          title="Remove member"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-3.5 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between">
          {team?.createdAt && (
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar size={11} />
              Created {new Date(team.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          )}
          <button
            onClick={closeAndReset}
            className="ml-auto px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* Sub-modals */}
      <CreateTeamModal open={modalOpen} setOpen={setModalOpen} mode="update" />
      <MemberModal
        open={memberModalOpen}
        onClose={setMemberModalOpen}
        mode={memberModalMode}
        member={selectedMember}
        setMember={setSelectedMember}
      />
      <ConfirmModal
        open={confirmOpen}
        title={confirmType === "deleteTeam" ? "Delete Team" : "Remove Member"}
        message={
          confirmType === "deleteTeam"
            ? "This action cannot be undone. The team and all its data will be permanently deleted."
            : "Are you sure you want to remove this member from the team?"
        }
        confirmText={confirmType === "deleteTeam" ? "Delete Team" : "Remove"}
        loading={deleting || removingMember}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
