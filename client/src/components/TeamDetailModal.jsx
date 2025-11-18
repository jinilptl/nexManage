import React, { useEffect, useState } from "react";
import { X, Edit, Trash2, Archive, UserPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedTeamData,
  setSelectedTeamId,
} from "../Redux_Config/Slices/teamsSlice";
import {
  deleteTeamService,
  fetchSingleTeamService,
} from "../services/teamsOperations/teamsServices";
import CreateTeamModal from "./CreateTeamModal";
import MemberModal from "./MemberModal";

export default function TeamDetailModal({ open, onClose }) {
  if (!open) return null;
  const token = useSelector((state) => state.auth.token);
  const teamid = useSelector((state) => state.teams.selectedTeam.id);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const[memberModalOpen,setMemberModalOpen]=useState(false)
  const [membermodalmode,setMemberModalMode]=useState("add")

  const selectedTeamData = useSelector(
    (state) => state.teams.selectedTeam.data
  );

  const members=useSelector((state)=>state.teams.teamMembers.list)
  

  const team = selectedTeamData || {};

  const handleDeleteTeam = () => {
    dispatch(deleteTeamService(teamid, token));
    onClose();
    dispatch(setSelectedTeamId(null));
  };

 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background Blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[88vh] overflow-y-auto p-6 animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={() => {
            onClose();
            dispatch(setSelectedTeamData(null));
            dispatch(setSelectedTeamId(null));
          }}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="border-b pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            {/* Team Name + Edit */}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                {team.teamName}
              </h2>

              <p className="text-gray-500 mt-1 flex items-center gap-2 wrap-break-words">
                {team.description}
              </p>
            </div>

            {/* Team Status */}
            <span className="px-3 sm:mr-8  py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium w-fit md:min-w-fit">
              {team.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              onClick={() => {
                setModalOpen(true);
                dispatch(setSelectedTeamId(teamid));
                dispatch(fetchSingleTeamService(teamid, token));
              }}
              className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm flex items-center gap-2 hover:bg-blue-700"
            >
              <Edit className="w-4 h-4" /> Update Team
            </button>

            <button className="px-3 py-2 rounded-md bg-yellow-100 text-yellow-700 text-sm flex items-center gap-2">
              <Archive className="w-4 h-4" /> Archive Team
            </button>

            <button
              onClick={() => {
                confirm("Are you sure you want to delete this team?") &&
                  handleDeleteTeam();
              }}
              className="px-3 py-2 rounded-md bg-red-100 text-red-700 text-sm flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Delete Team
            </button>
          </div>
        </div>

        {/* MEMBERS SECTION */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Team Members</h3>

            <button
              onClick={() => {
                setMemberModalMode("add")
                setMemberModalOpen(true);
              }}
              className="px-3 py-2 rounded-md bg-blue-50 text-blue-700 text-sm flex items-center gap-2 hover:bg-blue-100"
            >
              <UserPlus className="w-4 h-4" /> Add Member
            </button>
          </div>

          {/* MEMBERS LIST */}
          <div className="space-y-3">
            {team.members && team.members.length === 0 && (
              <p className="text-gray-500">No members in this team.</p>
            )}
              { members &&
              members.length > 0 &&
              members.map((m) => (
                <div
                  key={m._id}
                  className="p-3 rounded-lg border hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                      {m.user.name[0].toUpperCase()}
                    </div>

                    {/* Name + Role */}
                    <div className="flex flex-col min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {m.user.name.slice(0,1).toUpperCase() + m.user.name.slice(1)}
                      </p>
                      <p className="text-sm text-gray-500 capitalize truncate">
                        {m.roleInTeam}
                      </p>
                    </div>

                    {/* Status */}
                    <span
                      className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                        m.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>

                  {/* RIGHT SIDE — EDIT + DELETE */}
                  <div className="flex items-center gap-2 justify-end sm:justify-start">
                    <button className="p-2 rounded-md hover:bg-gray-100">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 rounded-md hover:bg-gray-100">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <CreateTeamModal open={modalOpen} setOpen={setModalOpen} mode="update" />

      <MemberModal open={memberModalOpen} onClose={setMemberModalOpen} mode={membermodalmode} />

    </div>
  );
}
