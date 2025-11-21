import React, { useState } from "react";
import { X, Edit, Trash2, Archive, UserPlus } from "lucide-react";
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
import ButtonLoader from "../../Lodders/ButtonLoader";

export default function TeamDetailModal({ open, onClose }) {
  if (!open) return null;

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.user.role);

  //  Correct loaders
  const deleting = useSelector((state) => state.teams.actions.deletingTeam);
  const updating = useSelector((state) => state.teams.actions.updatingTeam);
  const addingMember = useSelector((state) => state.teams.actions.addingMember);
  const updatingMember = useSelector((state) => state.teams.actions.updatingMember);
  const removingMember = useSelector((state) => state.teams.actions.removingMember);

  const fetchTeamLoading = useSelector((state) => state.teams.selectedTeam.loading);
  const membersLoading = useSelector((state) => state.teams.teamMembers.loading);

  const teamid = useSelector((state) => state.teams.selectedTeam.id);
  const selectedTeamData = useSelector((state) => state.teams.selectedTeam.data);
  const members = useSelector((state) => state.teams.teamMembers.list);

  const isAdmin = role === "admin" || role === "super_admin";

  const [modalOpen, setModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [membermodalmode, setMemberModalMode] = useState("add");
  const [selectedMember, setSelectedMember] = useState(null);

  const team = selectedTeamData || {};

  /* ---------------- DELETE TEAM ---------------- */
  const handleDeleteTeam = () => {
    if (confirm("Delete this team?")) {
      dispatch(deleteTeamService(teamid, token));
      onClose();
      dispatch(setSelectedTeamId(null));
    }
  };

  /* ---------------- REMOVE MEMBER ---------------- */
  const handleRemoveMember = (memberID) => {
    if (confirm("Remove member?")) {
      dispatch(removeTeamMemberService(teamid, memberID, token));
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-auto">

      {/* ALWAYS-FULL-SCREEN BACKDROP — FIXED */}
      <div
        className="fixed inset-0 bg-black/ixed top-0 left-0 w-screen h-screen bg-black/40 backdrop-blur-sm z-5"
        onClick={() => !updating && !deleting && onClose()}
      ></div>

      {/* TOP LOADER WHILE FETCHING TEAM / MEMBERS */}
      {(fetchTeamLoading || membersLoading) && (
        <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
          <ModalSmallLoader />
        </div>
      )}

      {/* MODAL BOX */}
      <div className="relative z-100 bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[88vh] overflow-y-auto p-6 animate-fadeIn">

        {/* CLOSE BUTTON */}
        <button
          disabled={updating || deleting}
          onClick={() => {
            onClose();
            dispatch(setSelectedTeamData(null));
            dispatch(setSelectedTeamId(null));
          }}
          className={`absolute top-4 right-4 p-2 rounded-full 
            ${updating || deleting ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="border-b pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900">
                {team.teamName}
              </h2>
              <p className="text-gray-500 mt-1">{team.description}</p>
            </div>

            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              {team.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* ACTION BUTTONS */}
          {isAdmin && (
            <div className="flex flex-wrap items-center gap-3 mt-4">

              {/* UPDATE TEAM */}
              <button
                disabled={updating}
                onClick={() => {
                  setModalOpen(true);
                  dispatch(fetchSingleTeamService(teamid, token));
                }}
                className={`px-3 py-2 rounded-md text-sm flex items-center gap-2
                  ${updating ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
              >
                {updating ? <ButtonLoader /> : <Edit className="w-4 h-4" />}
                {updating ? "Updating..." : "Update Team"}
              </button>

              {/* ARCHIVE TEAM (placeholder) */}
              <button
                className="px-3 py-2 rounded-md text-sm flex items-center gap-2 bg-yellow-100 text-yellow-700"
              >
                <Archive className="w-4 h-4" /> Archive Team
              </button>

              {/* DELETE TEAM */}
              <button
                disabled={deleting}
                onClick={handleDeleteTeam}
                className={`px-3 py-2 rounded-md text-sm flex items-center gap-2 
                  ${deleting ? "bg-red-200 cursor-not-allowed" : "bg-red-100 text-red-700 hover:bg-red-200"}`}
              >
                {deleting ? <ButtonLoader /> : <Trash2 className="w-4 h-4" />}
                {deleting ? "Deleting..." : "Delete Team"}
              </button>
            </div>
          )}
        </div>

        {/* MEMBERS SECTION */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Team Members</h3>

            {isAdmin && (
              <button
                disabled={addingMember}
                onClick={() => {
                  setMemberModalMode("add");
                  setMemberModalOpen(true);
                }}
                className={`px-3 py-2 rounded-md text-sm flex items-center gap-2
                  ${addingMember ? "bg-blue-100 cursor-not-allowed" : "bg-blue-50 text-blue-700 hover:bg-blue-100"}`}
              >
                {addingMember ? <ButtonLoader /> : <UserPlus className="w-4 h-4" />}
                {addingMember ? "Please wait..." : "Add Member"}
              </button>
            )}
          </div>

          {/* MEMBERS LIST */}
          <div className="space-y-3">
            {members?.length === 0 && (
              <p className="text-gray-500">No members in this team.</p>
            )}

            {members?.map((m) => (
              <div
                key={m.user?._id}
                className="p-3 rounded-lg border hover:bg-gray-50 flex flex-col sm:flex-row justify-between gap-4"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                    {m.user?.name?.charAt(0)?.toUpperCase()}
                  </div>

                  <div>
                    <p className="font-medium">{m.user?.name}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {m.roleInTeam}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-full 
                      ${m.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-300 text-gray-700"
                      }`}
                  >
                    {m.status}
                  </span>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-2">

                    <button
                      disabled={updatingMember}
                      onClick={() => {
                        setSelectedMember(m);
                        setMemberModalMode("update");
                        setMemberModalOpen(true);
                      }}
                      className={`p-2 rounded-md hover:bg-gray-100
                        ${updatingMember ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {updatingMember ? <ButtonLoader /> : <Edit className="w-4 h-4" />}
                    </button>

                    <button
                      disabled={removingMember}
                      onClick={() => handleRemoveMember(m.user._id)}
                      className={`p-2 rounded-md hover:bg-gray-100
                        ${removingMember ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {removingMember ? <ButtonLoader /> : <Trash2 className="w-4 h-4 text-red-600" />}
                    </button>

                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CHILD MODALS */}
      <CreateTeamModal open={modalOpen} setOpen={setModalOpen} mode="update" />
      <MemberModal
        open={memberModalOpen}
        onClose={setMemberModalOpen}
        mode={membermodalmode}
        member={selectedMember}
        setMember={setSelectedMember}
      />
    </div>
  );
}
