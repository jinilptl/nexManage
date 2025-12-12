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
import ProjectModal from "./ProjectModal";
import { useDispatch, useSelector } from "react-redux";
import {
  activeProjectMemberService,
  archiveProjectService,
  deleteProjectService,
  fetchProjectMembersService,
  removeProjectMemberService,
} from "../../services/projectsOperations/projectsServices";
import toast from "react-hot-toast";
import ProjectMemberModal from "./ProjectMemberModal";

export default function ViewProjectModal({ open, onClose, project }) {
  if (!open || !project) return null;
  const dispatch = useDispatch();
  const { id, data } = useSelector((state) => state.projects.selectedProject);
  const token = useSelector((state) => state.auth.token);
  const user=useSelector((state)=>state.auth.user)
  // console.log("user is ",user.role);
  const UserRole=user.role

  const { list } = useSelector((state) => state.teams);
  const allProjectMembers=useSelector((state)=>state.projects.projectMembers.list)
  // console.log("membver is " ,allProjectMembers);
  
  const [editModal, setEditModal] = useState(false);
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [memberModalMode, setMemberModalMode] = useState("add");
  const [editMemberModal, setEditMemberModal] = useState(false);
  const [editMemberData, setEditmember] = useState(null);

  useEffect(()=>{
    if(project._id&&token){
      dispatch(fetchProjectMembersService(project._id,token))
    }

  },[project._id])


  // console.log("project memeber ", project.projectMembers);

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

  const handleDelete = () => {
    if (confirm("are you want to delete this project??")) {
      dispatch(deleteProjectService(id, token, onClose));
    } else {
      return;
    }
  };

  const handleStatus = () => {
    if (data.status !== "archived") {
      if (confirm("do you want to push your project to archive mode??")) {
        dispatch(archiveProjectService(id, "archived", token, onClose));
      } else {
        return;
      }
    } else {
      toast.error("your project is already in archive mode");
    }
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl my-10">
        <div className="bg-white rounded-xl shadow-xl w-full relative p-5 md:p-6 animate-slideUp max-h-[92vh] md:max-h-[85vh] overflow-y-auto">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Header */}
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {project.projectName}
          </h2>
          <p className="text-gray-600 text-sm">
            {project.description || "No description provided"}
          </p>

          {/* Status */}
          <div className="mt-3">
            <span
              className={`px-3 py-1 text-xs rounded-md capitalize ${getStatusColor(
                project.status
              )}`}
            >
              {project.status}
            </span>
          </div>

          {/* Actions */}
          {UserRole!=="member"&&<div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => setEditModal(true)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md flex items-center gap-1 hover:bg-blue-700"
            >
              <Settings className="w-4 h-4" /> Edit
            </button>

            <button
              onClick={() => {
                setMemberModalMode("add");
                setAddMemberModal(true);
              }}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded-md flex items-center gap-1 hover:bg-green-700"
            >
              <UserPlus className="w-4 h-4" /> Add Member
            </button>

            <button
              onClick={() => {
                handleStatus();
              }}
              className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md flex items-center gap-1 hover:bg-yellow-600"
            >
              <Archive className="w-4 h-4" /> Archive
            </button>

            <button
              onClick={() => {
                handleDelete();
              }}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded-md flex items-center gap-1 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>}

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-6 h-6 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Created At</p>
                <p className="text-sm text-gray-900">
                  {new Date(project.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-6 h-6 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500 uppercase">
                  Project Manager
                </p>
                <p className="text-sm text-gray-900">
                  {project.projectManager?.name || "Not Assigned"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-6 h-6 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Members</p>
                <p className="text-sm text-gray-900">
                  {project.projectMembers?.length || 0} Members
                </p>
              </div>
            </div>

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

          {/* Members List */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold">Members</h3>
            <p className="text-gray-600 text-sm mb-3">
              People working on this project
            </p>

            <div className="space-y-3">
              {allProjectMembers?.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex justify-center items-center">
                      {member.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {member.user?.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {member.roleInProject}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {UserRole!=="member"&&member.status === "active" && (
                      <button
                        onClick={() => {
                          setMemberModalMode("edit");
                          setEditMemberModal(true);
                          setEditmember(member);
                        }}
                        className="p-1 hover:bg-gray-200 rounded-md"
                      >
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </button>
                    )}

                  {UserRole!=="member"&&  <button
                      onClick={() => {
                        if (member.status === "active") {
                          if (confirm("do you want to remove this member??")) {
                            dispatch(
                              removeProjectMemberService(
                                project._id,
                                member.user._id,
                                token
                              )
                            );
                          } else {
                            return;
                          }
                        }

                        if (member.status === "removed") {
                          if (
                            confirm("do you want to reActivate this member??")
                          ) {
                            dispatch(
                              activeProjectMemberService(
                                project._id,
                                member.user._id,
                                token
                              )
                            );
                          } else {
                            return;
                          }
                        }
                      }}
                      className="p-1 hover:bg-gray-200 rounded-md"
                    >
                      {member.status === "active" ? (
                        <Trash2 className="w-4 h-4 text-red-600 cursor-pointer  hover:text-red-700  hover:scale-110 transition" />
                      ) : (
                        <RefreshCw className=" w-4 h-4  text-green-600  cursor-pointer  hover:text-green-700 hover:scale-110 transition" />
                      )}
                    </button>}
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
              ))}
            </div>
          </div>

          {/* Close */}
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

      {editModal && (
        <ProjectModal
          open={editModal}
          onClose={() => setEditModal(false)}
          mode="edit"
          initialData={project}
          teamsList={list}
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
    </div>
  );
}
