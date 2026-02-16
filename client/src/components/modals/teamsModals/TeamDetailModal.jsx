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
import ConfirmModal from "./ConfirmModal";

export default function TeamDetailModal({ open, onClose }) {
  if (!open) return null;

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.user.role);

  // Loaders
  const deleting = useSelector((state) => state.teams.actions.deletingTeam);
  const updating = useSelector((state) => state.teams.actions.updatingTeam);
  const addingMember = useSelector((state) => state.teams.actions.addingMember);
  const updatingMember = useSelector(
    (state) => state.teams.actions.updatingMember,
  );
  const removingMember = useSelector(
    (state) => state.teams.actions.removingMember,
  );

  const fetchTeamLoading = useSelector(
    (state) => state.teams.selectedTeam.loading,
  );
  const membersLoading = useSelector(
    (state) => state.teams.teamMembers.loading,
  );

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

  const handleDeleteTeam = () => {
    setConfirmType("deleteTeam");
    setConfirmOpen(true);
  };

  const handleRemoveMember = (memberID) => {
    setConfirmType("removeMember");
    setSelectedMemberId(memberID);
    setConfirmOpen(true);
  };

  const handleConfirmAction = () => {
    if (confirmType === "deleteTeam") {
      dispatch(deleteTeamService(teamId, token));
      onClose();
      dispatch(setSelectedTeamId(null));
    }

    if (confirmType === "removeMember") {
      dispatch(removeTeamMemberService(teamId, selectedMemberId, token));
    }

    setConfirmOpen(false);
    setConfirmType(null);
    setSelectedMemberId(null);
  };

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (open) {
      document.body.classList.add("modal-open");
      return () => document.body.classList.remove("modal-open");
    }
  }, [open]);

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm modal-backdrop-enter"
        onClick={() => {
          if (!updating && !deleting) {
            onClose();
            dispatch(setSelectedTeamData(null));
            dispatch(setSelectedTeamId(null));
          }
        }}
      />

      {/* MODAL BOX */}
      <div className="relative bg-white w-full max-w-3xl rounded-xl shadow-2xl p-4 sm:p-6 modal-content-enter max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            disabled={updating || deleting}
            aria-label="Close team details dialog"
            onClick={() => {
              onClose();
              dispatch(setSelectedTeamData(null));
              dispatch(setSelectedTeamId(null));
            }}
            className={`absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer
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
                className={`px-3 py-1 text-sm bg-blue-600 text-white cursor-pointer rounded-md flex items-center gap-1 hover:bg-blue-700 
                  ${updating ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {updating ? <ButtonLoader /> : <Edit className="w-4 h-4" />}
                {updating ? "Updating..." : "Edit"}
              </button>

              {/* Archive */}
              <button className="px-3 py-1 text-sm bg-yellow-500 text-white cursor-pointer rounded-md flex items-center gap-1 hover:bg-yellow-600">
                <Archive className="w-4 h-4" /> Archive
              </button>

              {/* Delete */}
              <button
                disabled={deleting}
                onClick={handleDeleteTeam}
                className={`px-3 py-1 text-sm bg-red-600 text-white rounded-md cursor-pointer flex items-center gap-1 hover:bg-red-700 
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
                  className={`px-3 py-1 text-sm bg-green-600 text-white rounded-md cursor-pointer flex items-center gap-1 hover:bg-green-700 
                    ${addingMember ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {addingMember ? (
                    <ButtonLoader />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
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
                        className="p-1 hover:bg-gray-200 rounded-md cursor-pointer"
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
                        className="p-1 hover:bg-gray-200 rounded-md cursor-pointer"
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
              onClick={() => {
                onClose();
                dispatch(setSelectedTeamData(null));
                dispatch(setSelectedTeamId(null));
              }}
              className="px-4 py-2 cursor-pointer text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
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

      {/* CONFIRMATION MODAL */}
      <ConfirmModal
        open={confirmOpen}
        title={confirmType === "deleteTeam" ? "Delete Team" : "Remove Member"}
        message={
          confirmType === "deleteTeam"
            ? "This action cannot be undone. Do you want to delete this team?"
            : "Are you sure you want to remove this member from the team?"
        }
        confirmText="Yes"
        cancelText="Cancel"
        loading={deleting || removingMember}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
