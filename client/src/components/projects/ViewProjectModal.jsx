import React, { useEffect, useState } from "react";
import {
  X,
  Users,
  Calendar,
  FolderKanban,
  Pencil,
  Trash2,
  UserPlus,
  Settings,
  Archive,
  RefreshCw,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import ProjectModal from "./ProjectModal";
import ProjectMemberModal from "./ProjectMemberModal";

import {
  activeProjectMemberService,
  archiveProjectService,
  deleteProjectService,
  fetchProjectMembersService,
  removeProjectMemberService,
} from "../../services/projectsOperations/projectsServices";

import ModalSmallLoader from "../Lodders/ModalSmallLoader";
import ButtonLoader from "../Lodders/ButtonLoader";
import ConfirmModal from "../modals/teamsModals/ConfirmModal";
import toast from "react-hot-toast";

export default function ViewProjectModal({ open, onClose, project }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const UserRole = user?.role;

  const selectedProject = useSelector(
    (state) => state.projects.selectedProject,
  );
  const loadingProject = selectedProject.loading;

  const allProjectMembers = useSelector(
    (state) => state.projects.projectMembers.list,
  );
  const membersLoading = useSelector(
    (state) => state.projects.projectMembers.loading,
  );

  const {
    updating: updatingProject,
    deleting: deletingProject,
    archiving,
    addingMember,
    updatingMember,
    removingMember,
    activingMember,
  } = useSelector((state) => state.projects.actions);

  // LOCAL STATES FOR PER-MEMBER LOADER
  const [removingFor, setRemovingFor] = useState(null);
  const [activatingFor, setActivatingFor] = useState(null);

  const [editModal, setEditModal] = useState(false);
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [memberModalMode, setMemberModalMode] = useState("add");
  const [editMemberModal, setEditMemberModal] = useState(false);
  const [editMemberData, setEditmember] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  useEffect(() => {
    if (project?._id && token) {
      dispatch(fetchProjectMembersService(project._id, token));
    }
  }, [project?._id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "onhold":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "archived":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleDeleteProject = () => {
    setConfirmType("deleteProject");
    setConfirmOpen(true);
  };

  const handleArchiveProject = () => {
    if (project.status === "archived") {
      toast.error("Project is already archived");
      return;
    }
    setConfirmType("archiveProject");
    setConfirmOpen(true);
  };

  const handleMemberAction = (memberId, type) => {
    setConfirmType(type); // removeMember | activateMember
    setSelectedMemberId(memberId);
    setConfirmOpen(true);
  };

  const handleConfirmAction = () => {
    if (confirmType === "deleteProject") {
      dispatch(deleteProjectService(selectedProject.id, token, onClose));
    }

    if (confirmType === "archiveProject") {
      dispatch(
        archiveProjectService(selectedProject.id, "archived", token, onClose),
      );
    }

    if (confirmType === "removeMember") {
      setRemovingFor(selectedMemberId);
      dispatch(
        removeProjectMemberService(project._id, selectedMemberId, token),
      );
      setRemovingFor(null);
    }

    if (confirmType === "activateMember") {
      setActivatingFor(selectedMemberId);
      dispatch(
        activeProjectMemberService(project._id, selectedMemberId, token),
      );
      setActivatingFor(null);
    }

    setConfirmOpen(false);
    setConfirmType(null);
    setSelectedMemberId(null);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.classList.add("modal-open");
      return () => document.body.classList.remove("modal-open");
    }
  }, [open]);

  if (loadingProject) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm modal-backdrop-enter" />
        <div className="relative modal-content-enter">
          <ModalSmallLoader />
        </div>
      </div>
    );
  }

  if (!open || !project) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm modal-backdrop-enter"
        onClick={onClose}
      />

      {/* MODAL BOX */}
      <div className="relative bg-white w-full max-w-3xl rounded-xl shadow-2xl p-4 sm:p-6 modal-content-enter max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* HEADER */}
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {project.projectName}
        </h2>
        <p className="text-gray-600 text-sm">
          {project.description || "No description provided"}
        </p>

        {/* STATUS */}
        <div className="mt-3">
          <span
            className={`px-3 py-1 text-xs rounded-md capitalize ${getStatusColor(
              project.status,
            )}`}
          >
            {project.status}
          </span>
        </div>

        {/* ACTIONS */}
        {UserRole !== "member" && (
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => setEditModal(true)}
              disabled={updatingProject}
              className="px-3 py-1 text-sm bg-blue-600 text-white cursor-pointer rounded-md flex items-center gap-1 hover:bg-blue-700 disabled:opacity-50"
            >
              {updatingProject ? (
                <ButtonLoader />
              ) : (
                <Settings className="w-4 h-4" />
              )}
              Edit
            </button>

            <button
              onClick={() => {
                setMemberModalMode("add");
                setAddMemberModal(true);
              }}
              disabled={addingMember}
              className="px-3 py-1 text-sm bg-green-600 text-white cursor-pointer rounded-md flex items-center gap-1 hover:bg-green-700 disabled:opacity-50"
            >
              {addingMember ? (
                <ButtonLoader />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              Add Member
            </button>

            <button
              onClick={handleArchiveProject}
              disabled={archiving}
              className="px-3 py-1 text-sm bg-yellow-500 text-white cursor-pointer rounded-md flex items-center gap-1 hover:bg-yellow-600 disabled:opacity-50"
            >
              {archiving ? <ButtonLoader /> : <Archive className="w-4 h-4" />}
              Archive
            </button>

            <button
              onClick={handleDeleteProject}
              disabled={deletingProject}
              className="px-3 py-1 text-sm bg-red-600 text-white cursor-pointer rounded-md flex items-center gap-1 hover:bg-red-700 disabled:opacity-50"
            >
              {deletingProject ? (
                <ButtonLoader />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete
            </button>
          </div>
        )}

        {/* GRID INFO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          {/* CREATED AT */}
          <div className="flex items-start gap-3">
            <Calendar className="w-6 h-6 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Created At</p>
              <p className="text-sm text-gray-900">
                {new Date(project.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>

          {/* PROJECT MANAGER */}
          <div className="flex items-start gap-3">
            <Users className="w-6 h-6 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Project Manager</p>
              <p className="text-sm text-gray-900">
                {project.projectManager?.name || "Not Assigned"}
              </p>
            </div>
          </div>

          {/* MEMBERS COUNT */}
          <div className="flex items-start gap-3">
            <Users className="w-6 h-6 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Members</p>
              <p className="text-sm text-gray-900">
                {allProjectMembers?.length || 0} Members
              </p>
            </div>
          </div>

          {/* TEAMS COUNT */}
          <div className="flex items-start gap-3">
            <FolderKanban className="w-6 h-6 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Teams</p>
              <p className="text-sm text-gray-900">
                {project.teams?.length || 0} Teams
              </p>
            </div>
          </div>
        </div>

        {/* MEMBERS LIST */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold">Members</h3>
          <p className="text-gray-600 text-sm mb-3">
            People working on this project
          </p>

          {/* Loader for Members */}
          {membersLoading ? (
            <ModalSmallLoader />
          ) : allProjectMembers?.length === 0 ? (
            <p className="text-gray-500 text-sm">No members found.</p>
          ) : (
            <div className="space-y-3">
              {allProjectMembers.map((member, index) => {
                if (!member.user) return null;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                  >
                    {/* LEFT Section */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex justify-center items-center">
                        {member.user?.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {member.user?.name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {member.roleInProject}
                        </p>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2">
                      {/* EDIT ROLE */}
                      {UserRole !== "member" && member.status === "active" && (
                        <button
                          onClick={() => {
                            setMemberModalMode("edit");
                            setEditMemberModal(true);
                            setEditmember(member);
                          }}
                          className="p-1 hover:bg-gray-200 rounded-md cursor-pointer"
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </button>
                      )}

                      {/* REMOVE / ACTIVATE BUTTON WITH LOADER */}
                      {UserRole !== "member" && (
                        <button
                          onClick={() =>
                            handleMemberAction(
                              member.user._id,
                              member.status === "active"
                                ? "removeMember"
                                : "activateMember",
                            )
                          }
                          className="p-1 hover:bg-gray-200 rounded-md cursor-pointer"
                        >
                          {member.status === "active" ? (
                            <Trash2 className="w-4 h-4 text-red-600" />
                          ) : (
                            <RefreshCw className="w-4 h-4 text-green-600" />
                          )}
                        </button>
                      )}

                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          member.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {member.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CLOSE BUTTON */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* CHILD MODALS */}
      {editModal && (
        <ProjectModal
          open={editModal}
          onClose={() => setEditModal(false)}
          mode="edit"
          initialData={project}
          teamsList={project.teams}
        />
      )}

      {addMemberModal && (
        <ProjectMemberModal
          open={addMemberModal}
          onClose={() => setAddMemberModal(false)}
          mode={memberModalMode}
        />
      )}

      {editMemberModal && (
        <ProjectMemberModal
          open={editMemberModal}
          onClose={() => setEditMemberModal(false)}
          mode={memberModalMode}
          member={editMemberData}
        />
      )}
      <ConfirmModal
        open={confirmOpen}
        title={
          confirmType === "deleteProject"
            ? "Delete Project"
            : confirmType === "archiveProject"
              ? "Archive Project"
              : confirmType === "removeMember"
                ? "Remove Member"
                : "Activate Member"
        }
        message={
          confirmType === "deleteProject"
            ? "This action cannot be undone. Delete this project?"
            : confirmType === "archiveProject"
              ? "Move this project to archive?"
              : confirmType === "removeMember"
                ? "Remove this member from the project?"
                : "Reactivate this member?"
        }
        confirmText="Yes"
        cancelText="Cancel"
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
