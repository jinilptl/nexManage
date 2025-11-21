import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Users as UsersIcon,
  FolderKanban,
  MoreVertical,
} from "lucide-react";

import CreateTeamModal from "../../components/modals/teamsModals/CreateTeamModal";
import TeamDetailModal from "../../components/modals/teamsModals/TeamDetailModal";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchSingleTeamService,
  fetchTeamMembersService,
  fetchTeamsService,
} from "../../services/teamsOperations/teamsServices";
import { setSelectedTeamId } from "../../Redux_Config/Slices/teamsSlice";

// Loaders
import NexManageLoader from "../../components/Lodders/NexManageLoader";
import ButtonLoader from "../../components/Lodders/ButtonLoader";
import ModalSmallLoader from "../../components/Lodders/ModalSmallLoader";

export default function TeamsPage() {
  const dispatch = useDispatch();

  const { list, loading } = useSelector((state) => state.teams);
  const teamLoading = useSelector((state) => state.teams.selectedTeam.loading);
  const membersLoading = useSelector((state) => state.teams.teamMembers.loading);

  const selectedTeamId = useSelector((state) => state.teams.selectedTeam.id);

  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.user.role);

  const [filterTeams, setFilterTeams] = useState(list);
  const [searchInput, setSearchInput] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [openTeamModal, setOpenTeamModal] = useState(false);

  const [openMenuId, setOpenMenuId] = useState(null);

  /* ---------------- FETCH ALL TEAMS ---------------- */
  useEffect(() => {
    if (token && role) {
      dispatch(fetchTeamsService(token, role));
    }
  }, [token, role]);

  useEffect(() => {
    setFilterTeams(list);
  }, [list]);

  /* ---------------- SEARCH FILTER ---------------- */
  useEffect(() => {
    const filtered = list.filter((team) =>
      team.teamName.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilterTeams(filtered);
  }, [searchInput]);

  /* ---------------- CLOSE DROPDOWN ---------------- */
  useEffect(() => {
    const handler = () => setOpenMenuId(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  /* ---------------- OPEN TEAM MODAL AFTER FETCH ---------------- */
  useEffect(() => {
    if (!teamLoading && !membersLoading && selectedTeamId) {
      setOpenTeamModal(true);
    }
  }, [teamLoading, membersLoading, selectedTeamId]);

  useEffect(()=>{
   if(openTeamModal || modalOpen)
    document.body.style.overflow= 'hidden';
   else
    document.body.style.overflow= 'auto';
  },[openTeamModal, modalOpen])

  return (
    <div
      className={`md:pt-5 md:px-2 lg:px-6 pb-10 space-y-6 p-4 md:p-6 ${
        openTeamModal && "overflow-y-hidden"
      }`}
    >
      {/* MAIN PAGE LOADER */}
      {loading && <NexManageLoader />}

      {/* VIEW TEAM LOADER */}
      {(teamLoading || membersLoading) && (
  <div className="fixed top-0 left-0 w-screen h-screen z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
    <ModalSmallLoader />
  </div>
)}


      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-2 text-xl font-bold">Teams</h1>
          <p className="text-gray-600">Manage and organize your teams</p>
        </div>

        {(role === "admin" || role === "super_admin") && (
          <button
            disabled={loading}
            onClick={() => !loading && setModalOpen(true)}
            className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm 
             ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
          >
            {loading ? <ButtonLoader /> : <Plus className="w-4 h-4" />}
            {loading ? "Please wait" : "Create Team"}
          </button>
        )}
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            placeholder="Search teams..."
            disabled={loading}
            className={`w-full pl-10 pr-4 py-2 shadow-md rounded-md 
              focus:ring-2 ring-blue-500 outline-none
              ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      {/* EMPTY STATE */}
      {filterTeams.length === 0 && (
        <div className="bg-white rounded-lg shadow-md py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="w-8 h-8 text-gray-400" />
            </div>

            <h3 className="text-gray-900 mb-2 text-lg font-semibold">
              No teams found
            </h3>

            {(role === "admin" || role === "super_admin") && (
              <>
                <p className="text-gray-600 mb-6">
                  Create your first team to get started.
                </p>

                <button
                  disabled={loading}
                  onClick={() => setModalOpen(true)}
                  className={`bg-blue-600 text-white px-4 py-2 rounded-md flex items-center mx-auto gap-2 text-sm 
                    ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
                >
                  {loading ? <ButtonLoader /> : <Plus className="w-4 h-4" />}
                  {loading ? "Loading..." : "Create Team"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* TEAMS GRID */}
      {filterTeams.length > 0 && (
        <div className="grid md:mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filterTeams.map((team) => (
            <div
              key={team._id}
              className={`bg-white rounded-lg shadow-md hover:shadow-lg transition
                ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <div className="p-6">
                {/* TOP ROW */}
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <UsersIcon className="w-6 h-6 text-blue-600" />
                  </div>

                  {/* MENU BUTTON */}
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      disabled={loading}
                      className={`p-1 rounded-md ${
                        loading
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!loading)
                          setOpenMenuId(
                            openMenuId === team._id ? null : team._id
                          );
                      }}
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* DROPDOWN */}
                    {openMenuId === team._id && !loading && (
                      <div className="absolute right-0 mt-2 w-44 bg-white shadow-md rounded-lg z-50 animate-fadeIn">
                        <button
                          disabled={loading}
                          onClick={() => {
                            if (!loading) {
                              dispatch(setSelectedTeamId(team._id));
                              dispatch(fetchSingleTeamService(team._id, token));
                              dispatch(fetchTeamMembersService(team._id, token));
                              setOpenMenuId(null);
                            }
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          View Team
                        </button>

                        <div className="border-t"></div>

                        <button
                          disabled={loading}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 text-sm"
                        >
                          Archive Team
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* TEAM NAME */}
                <h2 className="text-lg font-semibold mt-3">{team.teamName}</h2>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {team.description}
                </p>

                {/* STATS */}
                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                      Team Lead
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                      <span className="text-sm text-gray-900">Jinil Patel</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm pt-3 border-t border-gray-300">
                    <div className="flex items-center gap-1 text-gray-600">
                      <UsersIcon className="w-4 h-4" />
                      <span>{team.members.length} members</span>
                    </div>

                    <div className="flex items-center gap-1 text-gray-600">
                      <FolderKanban className="w-4 h-4" />
                      <span>0 projects</span>
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="pt-3 border-t border-gray-300 flex items-center justify-between">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md">
                      {team.isActive ? "Active" : "Archived"}
                    </span>

                    <span className="text-xs text-gray-500 flex flex-col gap-1">
                      Created At
                      <span>
                        {new Date(team.createdAt).toLocaleDateString("en-GB")}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALS */}
      <CreateTeamModal open={modalOpen} setOpen={setModalOpen} />

      <TeamDetailModal
        open={openTeamModal}
        onClose={() => {
          setOpenTeamModal(false);
          dispatch(setSelectedTeamId(null));
        }}
      />
    </div>
  );
}
