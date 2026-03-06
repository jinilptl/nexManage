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
  RefreshCw,
  Crown,
  ChevronDown,
  Loader2,
  LayoutGrid,
  Shield,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import ProjectModal from "./ProjectModal";
import ProjectMemberModal from "./ProjectMemberModal";
import AddTeamToProjectModal from "./AddTeamToProjectModal";
import Avatar from "../common/Avatar";

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
import useScrollLock from "../../hooks/useScrollLock";

const STATUS_CONFIG = {
  ACTIVE: { label: "Active", dot: "bg-green-500", badge: "bg-green-50 text-green-700 border-green-200" },
  ON_HOLD: { label: "On Hold", dot: "bg-amber-500", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  COMPLETED: { label: "Completed", dot: "bg-blue-500", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  ARCHIVED: { label: "Archived", dot: "bg-gray-400", badge: "bg-gray-50 text-gray-600 border-gray-200" },
};

const getStatus = (s) => STATUS_CONFIG[(s || "ACTIVE").toUpperCase()] ?? STATUS_CONFIG.ACTIVE;

const ROLE_COLORS = {
  "project-manager": "bg-purple-100 text-purple-700 border-purple-200",
  developer: "bg-blue-100 text-blue-700 border-blue-200",
  designer: "bg-pink-100 text-pink-700 border-pink-200",
  tester: "bg-orange-100 text-orange-700 border-orange-200",
  qa: "bg-yellow-100 text-yellow-700 border-yellow-200",
  reviewer: "bg-indigo-100 text-indigo-700 border-indigo-200",
  contributor: "bg-teal-100 text-teal-700 border-teal-200",
  observer: "bg-gray-100 text-gray-600 border-gray-200",
};
const getRoleColor = (role) => ROLE_COLORS[role?.toLowerCase()] ?? "bg-gray-100 text-gray-600 border-gray-200";

function StatCard({ icon: Icon, label, value, color = "blue" }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3.5 shadow-xs">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${colorMap[color]}`}>
        <Icon size={17} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide truncate">{label}</p>
        <p className="text-sm font-bold text-gray-800 truncate">{value}</p>
      </div>
    </div>
  );
}

export default function ViewProjectModal({ open, onClose, project }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const UserRole = user?.role;

  const selectedProject = useSelector((state) => state.projects.selectedProject);
  const loadingProject = selectedProject.loading;

  const allProjectMembers = useSelector((state) => state.projects.projectMembers.list);
  const membersLoading = useSelector((state) => state.projects.projectMembers.loading);

  const {
    updating: updatingProject,
    deleting: deletingProject,
    archiving,
    addingMember,
  } = useSelector((state) => state.projects.actions);

  const [removingFor, setRemovingFor] = useState(null);
  const [activatingFor, setActivatingFor] = useState(null);

  const [editModal, setEditModal] = useState(false);
  const [addTeamModal, setAddTeamModal] = useState(false);
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

  const handleDeleteProject = () => { setConfirmType("deleteProject"); setConfirmOpen(true); };
  const handleArchiveProject = () => {
    if ((project.status || "").toUpperCase() === "ARCHIVED") { toast.error("Project is already archived"); return; }
    setConfirmType("archiveProject");
    setConfirmOpen(true);
  };
  const handleMemberAction = (memberId, type) => {
    setConfirmType(type);
    setSelectedMemberId(memberId);
    setConfirmOpen(true);
  };
  const handleConfirmAction = () => {
    if (confirmType === "deleteProject") dispatch(deleteProjectService(selectedProject.id, token, onClose));
    if (confirmType === "archiveProject") dispatch(archiveProjectService(selectedProject.id, "ARCHIVED", token, ""));
    if (confirmType === "removeMember") {
      setRemovingFor(selectedMemberId);
      dispatch(removeProjectMemberService(project._id, selectedMemberId, token));
      setRemovingFor(null);
    }
    if (confirmType === "activateMember") {
      setActivatingFor(selectedMemberId);
      dispatch(activeProjectMemberService(project._id, selectedMemberId, token));
      setActivatingFor(null);
    }
    setConfirmOpen(false);
    setConfirmType(null);
    setSelectedMemberId(null);
  };

  useScrollLock(open);

  if (loadingProject) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative"><ModalSmallLoader /></div>
      </div>
    );
  }

  if (!open || !project) return null;

  const status = getStatus(project.status);
  const isAdmin = UserRole !== "member";
  const activeMembers = allProjectMembers?.filter((m) => m.status === "active") ?? [];
  const removedMembers = allProjectMembers?.filter((m) => m.status !== "active") ?? [];

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >

        <div className="bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 px-6 pt-6 pb-5 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                <LayoutGrid className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-white truncate leading-tight">
                  {project.projectName}
                </h2>
                <p className="text-blue-200 text-xs mt-0.5 line-clamp-1">
                  {project.description || "No description provided"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-4 flex items-center flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${status.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20 capitalize">
              <FolderKanban size={11} />
              {project.projectType || "team"} project
            </span>
            {project.projectManager?.name && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
                <Crown size={11} />
                {project.projectManager.name}
              </span>
            )}
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard icon={Users} label="Members" value={allProjectMembers?.length ?? 0} color="blue" />
            <StatCard icon={FolderKanban} label="Teams" value={project.teams?.length ?? 0} color="violet" />
            <StatCard icon={Calendar} label="Created" value={new Date(project.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} color="emerald" />
            <StatCard icon={Shield} label="Type" value={(project.projectType || "team").charAt(0).toUpperCase() + (project.projectType || "team").slice(1)} color="amber" />
          </div>

          {isAdmin && (
            <div className="flex items-center gap-3 p-3.5 bg-gray-50 border border-gray-200 rounded-xl">
              <p className="text-sm font-semibold text-gray-700 shrink-0">Project Status</p>
              <div className="relative flex-1 max-w-[180px]">
                <select
                  id="project-status-select"
                  value={(project.status || "ACTIVE").toUpperCase()}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    if (newStatus && newStatus !== (project.status || "").toUpperCase()) {
                      dispatch(archiveProjectService(project._id, newStatus, token, ""));
                    }
                  }}
                  disabled={archiving}
                  className="w-full appearance-none text-sm bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer disabled:opacity-50 transition-all"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {archiving && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Loader2 size={12} className="animate-spin" /> Updating...
                </span>
              )}
            </div>
          )}

          {isAdmin && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setEditModal(true)}
                disabled={updatingProject}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                {updatingProject ? <ButtonLoader /> : <Settings size={14} />}
                Edit Project
              </button>

              <button
                onClick={() => { setMemberModalMode("add"); setAddMemberModal(true); }}
                disabled={addingMember}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                {addingMember ? <ButtonLoader /> : <UserPlus size={14} />}
                Add Member
              </button>

              <button
                onClick={() => setAddTeamModal(true)}
                disabled={updatingProject}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                <Users size={14} />
                Add Team
              </button>

              <button
                onClick={handleDeleteProject}
                disabled={deletingProject}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50 ml-auto"
              >
                {deletingProject ? <ButtonLoader /> : <Trash2 size={14} />}
                Delete
              </button>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Project Members</h3>
                <p className="text-xs text-gray-500 mt-0.5">People working on this project</p>
              </div>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                {allProjectMembers?.length ?? 0} total
              </span>
            </div>

            {membersLoading ? (
              <div className="flex items-center justify-center py-10">
                <ModalSmallLoader />
              </div>
            ) : allProjectMembers?.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Users size={18} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-500">No members yet</p>
                <p className="text-xs text-gray-400">Add team members to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeMembers.map((member, index) => {
                  if (!member.user) return null;
                  return (
                    <div
                      key={member.user._id ?? index}
                      className="flex items-center justify-between gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar user={member.user} className="w-9 h-9 shrink-0 ring-2 ring-white shadow-sm" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{member.user?.name}</p>
                          <p className="text-xs text-gray-400 truncate">{member.user?.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${getRoleColor(member.roleInProject)}`}>
                          {member.roleInProject}
                        </span>

                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-50 text-green-700 border border-green-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Active
                        </span>

                        {isAdmin && (
                          <>
                            <button
                              onClick={() => { setMemberModalMode("edit"); setEditMemberModal(true); setEditmember(member); }}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              title="Edit role"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleMemberAction(member.user._id, "removeMember")}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Remove member"
                            >
                              {removingFor === member.user._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}

                {removedMembers.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-2 pb-1">Removed</p>
                    {removedMembers.map((member, index) => {
                      if (!member.user) return null;
                      return (
                        <div
                          key={member.user._id ?? index}
                          className="flex items-center justify-between gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl opacity-70"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar user={member.user} className="w-9 h-9 shrink-0 ring-2 ring-white shadow-sm grayscale" />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-700 truncate">{member.user?.name}</p>
                              <p className="text-xs text-gray-400 truncate">{member.user?.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                              Removed
                            </span>
                            {isAdmin && (
                              <button
                                onClick={() => handleMemberAction(member.user._id, "activateMember")}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                                title="Re-activate"
                              >
                                {activatingFor === member.user._id ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {addTeamModal && (
        <AddTeamToProjectModal open={addTeamModal} onClose={() => setAddTeamModal(false)} project={project} />
      )}
      {editModal && (
        <ProjectModal open={editModal} onClose={() => setEditModal(false)} mode="edit" initialData={project} teamsList={project.teams} />
      )}
      {addMemberModal && (
        <ProjectMemberModal open={addMemberModal} onClose={() => setAddMemberModal(false)} mode={memberModalMode} />
      )}
      {editMemberModal && (
        <ProjectMemberModal open={editMemberModal} onClose={() => setEditMemberModal(false)} mode={memberModalMode} member={editMemberData} />
      )}

      <ConfirmModal
        open={confirmOpen}
        title={
          confirmType === "deleteProject" ? "Delete Project" :
            confirmType === "archiveProject" ? "Archive Project" :
              confirmType === "removeMember" ? "Remove Member" : "Activate Member"
        }
        message={
          confirmType === "deleteProject" ? "This action cannot be undone. Delete this project?" :
            confirmType === "archiveProject" ? "Move this project to archive?" :
              confirmType === "removeMember" ? "Remove this member from the project?" :
                "Reactivate this member?"
        }
        confirmText="Yes"
        cancelText="Cancel"
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
