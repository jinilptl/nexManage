import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Users as UsersIcon,
  FolderKanban,
  MoreVertical,
  Archive,
  RotateCcw,
  ArrowRight,
  Crown,
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
      className={`md:pt-5 md:px-2 lg:px-6 pb-10 space-y-6 p-4 md:p-6 ${openTeamModal && "overflow-y-hidden"
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-md transition-all cursor-pointer
             ${loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95"
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
                    ${loading
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
        <div className="grid md:mt-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filterTeams.map((team) => {
            const GRADIENTS = [
              "from-violet-500 to-purple-600",
              "from-blue-500 to-indigo-600",
              "from-emerald-500 to-teal-600",
              "from-rose-500 to-pink-600",
              "from-amber-500 to-orange-600",
              "from-cyan-500 to-sky-600",
            ];
            const gradient = GRADIENTS[(team.teamName || "").charCodeAt(0) % GRADIENTS.length];
            const initial = (team.teamName || "T")[0].toUpperCase();
            const isActive = (team.status || "").toUpperCase() === "ACTIVE";
            const lead = findTeamLeadUser(team);
            const leadName = findTeamLeadName(team);

            const visibleMembers = (team.members || []).slice(0, 4);
            const extraMembers = Math.max(0, (team.members || []).length - 4);

            return (
              <div
                key={team._id}
                className={`group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden relative ${loading ? "opacity-60 pointer-events-none" : ""
                  }`}
              >
                <div className={`h-1.5 w-full bg-linear-to-r ${gradient} shrink-0`} />

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                      <span className="text-lg font-black text-white">{initial}</span>
                    </div>

                    <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        disabled={loading}
                        className={`p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors ${loading ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                          }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!loading) setOpenMenuId(openMenuId === team._id ? null : team._id);
                        }}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openMenuId === team._id && !loading && (
                        <div
                          className="absolute right-0 mt-1 w-48 bg-white rounded-xl z-50 border border-gray-200 overflow-hidden py-1"
                          style={{ boxShadow: "0 8px 30px -4px rgba(0,0,0,0.12), 0 4px 12px -2px rgba(0,0,0,0.07)" }}
                        >
                          {role !== "member" && !isActive && (
                            <button
                              disabled={loading}
                              onClick={() => {
                                if (!loading) {
                                  dispatch(updateTeamStatusService(team._id, "ACTIVE", token, statusFilter));
                                  setOpenMenuId(null);
                                }
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                            >
                              <RotateCcw className="w-4 h-4" /> Activate Team
                            </button>
                          )}

                          {role !== "member" && isActive && (
                            <button
                              disabled={loading}
                              onClick={() => {
                                if (!loading) {
                                  dispatch(updateTeamStatusService(team._id, "ARCHIVED", token, statusFilter));
                                  setOpenMenuId(null);
                                }
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                            >
                              <Archive className="w-4 h-4" /> Archive Team
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <h2 className="text-base font-bold text-gray-900 group-hover:text-violet-600 transition-colors line-clamp-1 mb-1">
                    {team.teamName}
                  </h2>

                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 flex-1 mb-4">
                    {team.description || "No description provided"}
                  </p>

                  {leadName && (
                    <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-violet-50 border border-violet-100 rounded-xl">
                      <Crown size={13} className="text-violet-500 shrink-0" />
                      <Avatar user={lead} className="w-5 h-5 text-[9px] shadow-sm" />
                      <span className="text-xs font-semibold text-violet-700 truncate">{leadName}</span>
                      <span className="ml-auto text-[10px] text-violet-400 font-medium">Team Lead</span>
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {team.members.length > 0 ? (
                          <>
                            <div className="flex -space-x-2">
                              {visibleMembers.map((m, i) => (
                                <Avatar
                                  key={i}
                                  user={m.user}
                                  className="w-6 h-6 text-[9px] ring-2 ring-white shadow-sm"
                                />
                              ))}
                              {extraMembers > 0 && (
                                <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white ring-1 ring-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-500">
                                  +{extraMembers}
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-gray-400 font-medium">
                              {team.members.length} member{team.members.length !== 1 ? "s" : ""}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No members</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {(team.projectsCount ?? 0) > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                            <FolderKanban size={10} />
                            {team.projectsCount}
                          </span>
                        )}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-gray-100 text-gray-500 border-gray-200"
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-gray-400"}`} />
                          {isActive ? "Active" : "Archived"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        dispatch(setSelectedTeamId(team._id));
                        dispatch(fetchSingleTeamService(team._id, token));
                        dispatch(fetchTeamMembersService(team._id, token));
                      }}
                      className={`mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer bg-linear-to-r ${gradient} text-white opacity-0 group-hover:opacity-100 shadow-md hover:shadow-lg active:scale-95`}
                    >
                      View Team <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                <div className="px-5 py-2.5 border-t border-gray-50 bg-gray-50/60 flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide">By</span>
                  <span className="text-xs font-semibold text-gray-600 truncate">
                    {findCreatedBy(team) || "Unknown"}
                  </span>
                  <span className="ml-auto text-[10px] text-gray-400">
                    {new Date(team.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
            );
          })}
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
