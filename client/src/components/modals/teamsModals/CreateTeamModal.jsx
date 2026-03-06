import React, { useEffect } from "react";
import { X, Users, FileText, PenLine, Sparkles } from "lucide-react";
import {
  createTeamService,
  updateTeamService,
} from "../../../services/teamsOperations/teamsServices";
import { useDispatch, useSelector } from "react-redux";
import useScrollLock from "../../../hooks/useScrollLock";

const MAX_DESC = 300;

export default function CreateTeamModal({ open, setOpen, mode }) {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const creating = useSelector((state) => state.teams.actions.creatingTeam);
  const updating = useSelector((state) => state.teams.actions.updatingTeam);
  const modalLoading = creating || updating;

  const teamdata = useSelector((state) => state.teams.selectedTeam.data);

  const [inputData, setInputData] = React.useState({
    teamName: "",
    description: "",
  });

  const isUpdate = mode === "update";

  useEffect(() => {
    if (isUpdate && teamdata) {
      setInputData({
        teamName: teamdata.teamName,
        description: teamdata.description,
      });
    } else if (!isUpdate) {
      setInputData({ teamName: "", description: "" });
    }
  }, [mode, teamdata]);

  const handleChange = (e) => {
    setInputData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isUpdate) {
      dispatch(updateTeamService(teamdata._id, inputData, token, setOpen));
    } else {
      dispatch(createTeamService(inputData, token, setOpen));
    }
  };

  useScrollLock(open);
  if (!open) return null;

  const descLength = inputData.description.length;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !modalLoading && setOpen(false)}
      />

      <div
        className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-linear-to-br from-violet-600 via-violet-700 to-purple-800 px-6 py-5 shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white leading-tight">
                  {isUpdate ? "Update Team" : "Create New Team"}
                </h2>
                <p className="text-violet-200 text-xs mt-0.5">
                  {isUpdate
                    ? "Edit your team's name and description"
                    : "Set up a new team for collaboration"}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={modalLoading}
              onClick={() => !modalLoading && setOpen(false)}
              aria-label="Close dialog"
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-6 py-5 flex-1">
          <form id="team-form" className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                <PenLine size={13} className="text-gray-400" />
                Team Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="teamName"
                required
                value={inputData.teamName}
                disabled={modalLoading}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="e.g. Frontend Engineers"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                  <FileText size={13} className="text-gray-400" />
                  Description
                </label>
                <span
                  className={`text-xs font-medium tabular-nums transition-colors ${descLength > MAX_DESC * 0.9
                      ? "text-red-500"
                      : descLength > MAX_DESC * 0.7
                        ? "text-amber-500"
                        : "text-gray-400"
                    }`}
                >
                  {descLength}/{MAX_DESC}
                </span>
              </div>
              <textarea
                name="description"
                value={inputData.description}
                disabled={modalLoading}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_DESC) handleChange(e);
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="What does this team work on? Any specific goals or responsibilities..."
                rows={4}
              />

              <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${descLength > MAX_DESC * 0.9
                      ? "bg-red-500"
                      : descLength > MAX_DESC * 0.7
                        ? "bg-amber-400"
                        : "bg-violet-500"
                    }`}
                  style={{ width: `${Math.min((descLength / MAX_DESC) * 100, 100)}%` }}
                />
              </div>
            </div>

            {!isUpdate && (
              <div className="flex items-start gap-2.5 bg-violet-50 border border-violet-100 rounded-xl px-3.5 py-3">
                <Sparkles size={15} className="text-violet-500 mt-0.5 shrink-0" />
                <p className="text-xs text-violet-700 leading-relaxed">
                  After creating the team, you can invite members and assign
                  them roles from the team detail page.
                </p>
              </div>
            )}
          </form>
        </div>

        <div className="shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50/60 flex justify-end gap-3">
          <button
            type="button"
            disabled={modalLoading}
            onClick={() => !modalLoading && setOpen(false)}
            className="px-5 py-2.5 text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            form="team-form"
            type="submit"
            disabled={modalLoading}
            className="px-6 py-2.5 text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {modalLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                {isUpdate ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Users size={15} />
                {isUpdate ? "Update Team" : "Create Team"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
