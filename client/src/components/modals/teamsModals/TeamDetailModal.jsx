import React, { useState } from "react";
import { 
  X, Edit, Trash2, Archive, UserPlus 
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
import ButtonLoader from "../../Lodders/ButtonLoader";

export default function TeamDetailModal({ open, onClose }) {
  if (!open) return null;

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.user.role);

  // Loaders
  const deleting = useSelector((state) => state.teams.actions.deletingTeam);
  const updating = useSelector((state) => state.teams.actions.updatingTeam);
  const addingMember = useSelector((state) => state.teams.actions.addingMember);
  const updatingMember = useSelector((state) => state.teams.actions.updatingMember);
  const removingMember = useSelector((state) => state.teams.actions.removingMember);

  const fetchTeamLoading = useSelector((state) => state.teams.selectedTeam.loading);
  const membersLoading = useSelector((state) => state.teams.teamMembers.loading);

  const teamId = useSelector((state) => state.teams.selectedTeam.id);
  const team = useSelector((state) => state.teams.selectedTeam.data);
  const members = useSelector((state) => state.teams.teamMembers.list);

  const isAdmin = role === "admin" || role === "super_admin";

  const [modalOpen, setModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [memberModalMode, setMemberModalMode] = useState("add");
  const [selectedMember, setSelectedMember] = useState(null);

  /* ---------------- DELETE TEAM ---------------- */
  const handleDeleteTeam = () => {
    if (confirm("Delete this team?")) {
      dispatch(deleteTeamService(teamId, token));
      onClose();
      dispatch(setSelectedTeamId(null));
    }
  };

  /* ---------------- REMOVE MEMBER ---------------- */
  const handleRemoveMember = (memberID) => {
    if (confirm("Remove member?")) {
      dispatch(removeTeamMemberService(teamId, memberID, token));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl my-10">
        <div className="bg-white rounded-xl shadow-xl w-full relative p-5 md:p-6 animate-slideUp max-h-[92vh] md:max-h-[85vh] overflow-y-auto">

          {/* Close Button */}
          <button
            disabled={updating || deleting}
            onClick={() => {
              onClose();
              dispatch(setSelectedTeamData(null));
              dispatch(setSelectedTeamId(null));
            }}
            className={`absolute top-3 right-3 p-1 rounded-md hover:bg-gray-100 
              ${updating || deleting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Loading Overlay */}
          {(fetchTeamLoading || membersLoading) && (
            <div className="absolute inset-0 z-50 bg-white/60 flex items-center justify-center">
              <ModalSmallLoader />
            </div>
          )}

          {/* HEADER */}
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {team?.teamName}
          </h2>

          <p className="text-gray-600 text-sm">{team?.description}</p>

          {/* STATUS */}
          <div className="mt-3">
            <span
              className={`px-3 py-1 text-xs rounded-md ${
                team?.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {team?.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* ACTION BUTTONS */}
          {isAdmin && (
            <div className="mt-5 flex flex-wrap gap-2">

              {/* Update */}
              <button
                disabled={updating}
                onClick={() => {
                  setModalOpen(true);
                  dispatch(fetchSingleTeamService(teamId, token));
                }}
                className={`px-3 py-1 text-sm bg-blue-600 text-white rounded-md flex items-center gap-1 hover:bg-blue-700 
                  ${updating ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {updating ? <ButtonLoader /> : <Edit className="w-4 h-4" />}
                {updating ? "Updating..." : "Edit"}
              </button>

              {/* Archive */}
              <button
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md flex items-center gap-1 hover:bg-yellow-600"
              >
                <Archive className="w-4 h-4" /> Archive
              </button>

              {/* Delete */}
              <button
                disabled={deleting}
                onClick={handleDeleteTeam}
                className={`px-3 py-1 text-sm bg-red-600 text-white rounded-md flex items-center gap-1 hover:bg-red-700 
                  ${deleting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {deleting ? <ButtonLoader /> : <Trash2 className="w-4 h-4" />}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}

          {/* MEMBERS SECTION */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Team Members</h3>

              {isAdmin && (
                <button
                  disabled={addingMember}
                  onClick={() => {
                    setMemberModalMode("add");
                    setMemberModalOpen(true);
                  }}
                  className={`px-3 py-1 text-sm bg-green-600 text-white rounded-md flex items-center gap-1 hover:bg-green-700 
                    ${addingMember ? "opacity-50 cursor-not-allowed" : ""}`}
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
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex justify-center items-center">
                      {m.user?.name?.charAt(0)?.toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-semibold">{m.user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {m.roleInTeam}
                      </p>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-2">

                      {/* Edit */}
                      <button
                        disabled={updatingMember}
                        onClick={() => {
                          setSelectedMember(m);
                          setMemberModalMode("update");
                          setMemberModalOpen(true);
                        }}
                        className="p-1 hover:bg-gray-200 rounded-md"
                      >
                        {updatingMember ? (
                          <ButtonLoader />
                        ) : (
                          <Edit className="w-4 h-4 text-blue-600" />
                        )}
                      </button>

                      {/* Remove */}
                      <button
                        disabled={removingMember}
                        onClick={() => handleRemoveMember(m.user._id)}
                        className="p-1 hover:bg-gray-200 rounded-md"
                      >
                        {removingMember ? (
                          <ButtonLoader />
                        ) : (
                          <Trash2 className="w-4 h-4 text-red-600" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* CHILD MODALS */}
      <CreateTeamModal open={modalOpen} setOpen={setModalOpen} mode="update" />
      <MemberModal
        open={memberModalOpen}
        onClose={setMemberModalOpen}
        mode={memberModalMode}
        member={selectedMember}
        setMember={setSelectedMember}
      />
    </div>
  );
}
