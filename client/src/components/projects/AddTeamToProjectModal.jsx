import React, { useEffect, useState } from "react";
import { X, Users, UserPlus, Loader2, Search, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ButtonLoader from "../Lodders/ButtonLoader";
import { fetchTeamsService } from "../../services/teamsOperations/teamsServices";
import { updateProjectService } from "../../services/projectsOperations/projectsServices";
import useScrollLock from "../../hooks/useScrollLock";

export default function AddTeamToProjectModal({ open, onClose, project }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const allTeams = useSelector((state) => state.teams.list);
  const updating = useSelector((state) => state.projects.actions.updating);

  const [selectedTeams, setSelectedTeams] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      if (!allTeams || allTeams.length === 0) dispatch(fetchTeamsService(token));
    }
  }, [open, allTeams, dispatch, token]);

  useEffect(() => {
    if (project && allTeams) {
      const currentTeamIds = project.teams?.map((t) => t._id) || [];
      setAvailableTeams(allTeams.filter((t) => !currentTeamIds.includes(t._id) && t.status !== "archived"));
      setSelectedTeams([]);
    }
  }, [project, allTeams]);

  useScrollLock(open);

  if (!open) return null;

  const filtered = availableTeams.filter((t) =>
    t.teamName.toLowerCase().includes(search.toLowerCase())
  );

  const toggleTeam = (teamId) =>
    setSelectedTeams((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]
    );

  const handleSubmit = () => {
    if (selectedTeams.length === 0) return;
    const currentTeamIds = project.teams?.map((t) => t._id) || [];
    dispatch(updateProjectService(project._id, { teams: [...currentTeamIds, ...selectedTeams] }, token, onClose));
  };

  const GRADIENTS = ["from-violet-500 to-purple-600", "from-blue-500 to-indigo-600", "from-emerald-500 to-teal-600", "from-rose-500 to-pink-600", "from-amber-500 to-orange-600", "from-cyan-500 to-sky-600"];
  const getGrad = (name = "") => GRADIENTS[name.charCodeAt(0) % GRADIENTS.length];

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !updating && onClose()} />

      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: "92vh" }}>
        <div className="bg-linear-to-br from-violet-600 via-violet-700 to-purple-800 px-5 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
                <UserPlus size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-sm">Add Teams</h2>
                <p className="text-violet-200 text-xs line-clamp-1">
                  to <span className="font-semibold">{project?.projectName}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={updating}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer disabled:opacity-40"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search teams…"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
            />
          </div>

          {selectedTeams.length > 0 && (
            <div className="flex items-center justify-between px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-xl">
              <span className="text-xs font-semibold text-violet-700">
                {selectedTeams.length} team{selectedTeams.length > 1 ? "s" : ""} selected
              </span>
              <button
                type="button"
                onClick={() => setSelectedTeams([])}
                className="text-xs text-violet-500 hover:text-violet-700 font-medium cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}

          <div className="space-y-1.5">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <Users size={20} className="text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">
                  {availableTeams.length === 0 ? "All teams are already added" : "No teams match your search"}
                </p>
              </div>
            ) : (
              filtered.map((team) => {
                const sel = selectedTeams.includes(team._id);
                const grad = getGrad(team.teamName);
                return (
                  <label
                    key={team._id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${sel
                        ? "bg-violet-50 border-violet-300 ring-1 ring-violet-200"
                        : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    <input type="checkbox" className="sr-only" checked={sel} onChange={() => toggleTeam(team._id)} disabled={updating} />

                    <div className={`w-9 h-9 rounded-xl bg-linear-to-br ${grad} flex items-center justify-center shrink-0 shadow-sm`}>
                      <span className="text-sm font-black text-white">
                        {(team.teamName || "T")[0].toUpperCase()}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{team.teamName}</p>
                      <p className="text-xs text-gray-400">
                        {team.members?.length || 0} members
                      </p>
                    </div>

                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${sel ? "bg-violet-600 border-violet-600" : "border-gray-300"
                      }`}>
                      {sel && <Check size={11} className="text-white" strokeWidth={3} />}
                    </div>
                  </label>
                );
              })
            )}
          </div>
        </div>

        <div className="shrink-0 px-5 py-4 border-t border-gray-100 bg-gray-50/60 flex justify-end gap-3">
          <button
            disabled={updating}
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            disabled={updating || selectedTeams.length === 0}
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-violet-200"
          >
            {updating
              ? <><Loader2 size={14} className="animate-spin" /> Adding…</>
              : <><UserPlus size={14} /> Add {selectedTeams.length > 0 ? `${selectedTeams.length} ` : ""}Team{selectedTeams.length !== 1 ? "s" : ""}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}
