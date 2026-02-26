import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Users as UsersIcon,
  FolderKanban,
  MoreVertical,
  Eye,
  Archive,
  RotateCcw,
} from "lucide-react";

import CreateTeamModal from "../../components/modals/teamsModals/CreateTeamModal";
import TeamDetailModal from "../../components/modals/teamsModals/TeamDetailModal";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchSingleTeamService,
  fetchTeamMembersService,
  fetchTeamsService,
  updateTeamStatusService,
} from "../../services/teamsOperations/teamsServices";
import { setSelectedTeamId } from "../../Redux_Config/Slices/teamsSlice";

import NexManageLoader from "../../components/Lodders/NexManageLoader";
import ButtonLoader from "../../components/Lodders/ButtonLoader";
import ModalSmallLoader from "../../components/Lodders/ModalSmallLoader";
import Avatar from "../../components/common/Avatar";

export default function TeamsPage() {
  const dispatch = useDispatch();

  const { list, loading } = useSelector((state) => state.teams);
  const teamLoading = useSelector((state) => state.teams.selectedTeam.loading);
  const membersLoading = useSelector(
    (state) => state.teams.teamMembers.loading,
  );

  const selectedTeamId = useSelector((state) => state.teams.selectedTeam.id);

  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.user.role);

  const [filterTeams, setFilterTeams] = useState(list);
  const [searchInput, setSearchInput] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [openTeamModal, setOpenTeamModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ACTIVE");
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    document.title = "Teams | NexManage";
  }, []);

  useEffect(() => {
    if (token && role) {
      dispatch(fetchTeamsService(token, role, statusFilter));
    }
  }, [token, role, statusFilter]);

  useEffect(() => {
    setFilterTeams(list);
  }, [list]);

  useEffect(() => {
    const filtered = list.filter((team) =>
      team.teamName.toLowerCase().includes(searchInput.toLowerCase()),
    );
    setFilterTeams(filtered);
  }, [searchInput]);

  useEffect(() => {
    const handler = () => setOpenMenuId(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    if (!teamLoading && !membersLoading && selectedTeamId) {
      setOpenTeamModal(true);
    }
  }, [teamLoading, membersLoading, selectedTeamId]);

  useEffect(() => {
    if (openTeamModal || modalOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [openTeamModal, modalOpen]);

  const capitalizedName = (name = "") => {
    if (!name || typeof name !== "string") return "Unknown";

    const parts = name.trim().split(" ");

    const firstName =
      parts[0]?.charAt(0).toUpperCase() + parts[0]?.slice(1).toLowerCase();

    const lastName = parts[1]
      ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase()
      : "";

    return lastName ? `${firstName} ${lastName}` : firstName;
  };

  const findTeamLeadName = (team) => {
    const lead = team.members.find(
      (member) => member.roleInTeam === "team lead",
    );
    if (lead) {
      return capitalizedName(lead.user.name);
    }
  };

  const findTeamLeadUser = (team) => {
    const lead = team.members.find(
      (member) => member.roleInTeam === "team lead",
    );
    return lead ? lead.user : null;
  };

  const findCreatedBy = (team) => {
    if (team.createdby) {
      return capitalizedName(team.createdby.name);
    }
  };

  if (loading) {
    return (
      <div className=" flex justify-center items-center h-[70vh]">
        <NexManageLoader />
      </div>
    );
  }

  return (
    <div
      className={`md:pt-5 md:px-2 lg:px-6 pb-10 space-y-6 p-4 md:p-6 ${
        openTeamModal && "overflow-y-hidden"
      }`}
    >
      {(teamLoading || membersLoading) && (
        <div className="fixed top-0 left-0 w-screen h-screen z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <ModalSmallLoader />
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900  text-2xl font-bold">Teams</h1>
          <p className="text-gray-600">Manage and organize your teams</p>
        </div>

        {(role === "admin" || role === "super_admin") && (
          <button
            disabled={loading}
            onClick={() => !loading && setModalOpen(true)}
            className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm cursor-pointer
             ${
               loading
                 ? "bg-blue-300 cursor-not-allowed"
                 : "bg-blue-600 hover:bg-blue-700 text-white"
             }`}
          >
            {loading ? <ButtonLoader /> : <Plus className="w-4 h-4" />}
            {loading ? "Please wait" : "Create Team"}
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors duration-200" />
            <input
              placeholder="Search teams..."
              disabled={loading}
              className={`w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-medium text-gray-700 placeholder:text-gray-400 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div className="relative w-full sm:w-56">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              disabled={loading}
              className={`w-full appearance-none bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <option value="ACTIVE" className="font-medium">
                Active Teams
              </option>
              <option value="ARCHIVED" className="font-medium">
                Archived Teams
              </option>
              <option value="ALL" className="font-medium">
                All Teams
              </option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {filterTeams.length === 0 && (
        <div className="bg-white rounded-lg shadow-md py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="w-8 h-8 text-gray-500" />
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
                    ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-700"
                    }`}
                >
                  {loading ? <ButtonLoader /> : <Plus className="w-4 h-4" />}
                  {loading ? "Loading..." : "Create Team"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {filterTeams.length > 0 && (
        <div className="grid md:mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filterTeams.map((team) => (
            <div
              key={team._id}
              className={`bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group flex flex-col h-full
                ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center border border-blue-100/50 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <UsersIcon className="w-6 h-6 text-blue-600" />
                  </div>

                  <div
                    className="relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      disabled={loading}
                      className={`p-1.5 rounded-lg transition-colors duration-200 text-gray-400 hover:text-gray-700 hover:bg-gray-100 ${
                        loading
                          ? "opacity-40 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!loading)
                          setOpenMenuId(
                            openMenuId === team._id ? null : team._id,
                          );
                      }}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {openMenuId === team._id && !loading && (
                      <div
                        className="absolute right-0 mt-2 w-52 bg-white rounded-xl z-50 border border-gray-200 overflow-hidden"
                        style={{
                          boxShadow:
                            "0 10px 40px -10px rgba(0,0,0,0.15), 0 4px 12px -2px rgba(0,0,0,0.08)",
                        }}
                      >
                        <div className="h-2px bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

                        <div className="px-3 pt-2.5 pb-1.5">
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            Actions
                          </p>
                        </div>

                        <div className="px-1.5 pb-1.5 space-y-0.5">
                          <button
                            disabled={loading}
                            onClick={() => {
                              if (!loading) {
                                dispatch(setSelectedTeamId(team._id));
                                dispatch(
                                  fetchSingleTeamService(team._id, token),
                                );
                                dispatch(
                                  fetchTeamMembersService(team._id, token),
                                );
                                setOpenMenuId(null);
                              }
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                            View Team
                          </button>

                          {role !== "member" &&
                            (team.status || "").toUpperCase() !==
                              "ARCHIVED" && (
                              <button
                                disabled={loading}
                                onClick={() => {
                                  if (!loading) {
                                    dispatch(
                                      updateTeamStatusService(
                                        team._id,
                                        "ARCHIVED",
                                        token,
                                        statusFilter,
                                      ),
                                    );
                                    setOpenMenuId(null);
                                  }
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition-colors duration-150 cursor-pointer"
                              >
                                <Archive className="w-4 h-4" />
                                Archive Team
                              </button>
                            )}

                          {role !== "member" &&
                            (team.status || "").toUpperCase() ===
                              "ARCHIVED" && (
                              <button
                                disabled={loading}
                                onClick={() => {
                                  if (!loading) {
                                    dispatch(
                                      updateTeamStatusService(
                                        team._id,
                                        "ACTIVE",
                                        token,
                                        statusFilter,
                                      ),
                                    );
                                    setOpenMenuId(null);
                                  }
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-150 cursor-pointer"
                              >
                                <RotateCcw className="w-4 h-4" />
                                Activate Team
                              </button>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mt-5 group-hover:text-blue-600 transition-colors duration-200 line-clamp-1">
                  {team.teamName}
                </h2>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed grow">
                  {team.description || "No description provided"}
                </p>

                <div className="mt-6 space-y-5">
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Team Lead
                    </p>
                    {findTeamLeadName(team) ? (
                      <div className="flex items-center gap-2">
                        <Avatar
                          user={findTeamLeadUser(team)}
                          className="w-6 h-6 text-[10px] shadow-sm border md:border-white"
                        />
                        <span className="text-sm font-bold text-gray-700">
                          {findTeamLeadName(team)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-gray-500 italic">
                        No team lead available
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm pt-5 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                      <UsersIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-xs font-bold text-gray-700">
                        {team.members.length}
                      </span>
                      <span className="text-xs font-medium text-gray-500">
                        Members
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                      <FolderKanban className="w-4 h-4 text-gray-500" />
                      <span className="text-xs font-bold text-gray-700">
                        {team.projectsCount ?? 0}
                      </span>
                      <span className="text-xs font-medium text-gray-500">
                        Projects
                      </span>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full border ${
                        (team.status || "").toUpperCase() === "ACTIVE"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}
                    >
                      {(team.status || "").toUpperCase() === "ACTIVE"
                        ? "Active"
                        : "Archived"}
                    </span>

                    <span className="text-[11px] font-medium text-gray-400">
                      Created{" "}
                      {new Date(team.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Created By
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-700">
                        {findCreatedBy(team) || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
