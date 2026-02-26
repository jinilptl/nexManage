import React, { useEffect } from "react";
import { X } from "lucide-react";
import {
  createTeamService,
  updateTeamService,
} from "../../../services/teamsOperations/teamsServices";
import { useDispatch, useSelector } from "react-redux";
import ModalSmallLoader from "../../Lodders/ModalSmallLoader";

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

  useEffect(() => {
    if (mode === "update" && teamdata) {
      setInputData({
        teamName: teamdata.teamName,
        description: teamdata.description,
      });
    }
  }, [mode, teamdata]);

  const handleChange = (e) => {
    setInputData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "update") {
      dispatch(updateTeamService(teamdata._id, inputData, token, setOpen));
    } else {
      dispatch(createTeamService(inputData, token, setOpen));
    }
  };

  React.useEffect(() => {
    if (open) {
      document.body.classList.add("modal-open");
      return () => document.body.classList.remove("modal-open");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm modal-backdrop-enter"
        onClick={() => !modalLoading && setOpen(false)}
      />

      <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl p-4 sm:p-6 modal-content-enter">
        <button
          type="button"
          disabled={modalLoading}
          onClick={() => !modalLoading && setOpen(false)}
          aria-label="Close create team dialog"
          className={`absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100 cursor-pointer
          ${modalLoading && "opacity-40 cursor-not-allowed"}`}
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {mode === "update" ? "Update Team" : "Create New Team"}
        </h2>

        {modalLoading && <ModalSmallLoader />}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-gray-700">Team Name</label>
            <input
              type="text"
              name="teamName"
              value={inputData.teamName}
              disabled={modalLoading}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-2 bg-gray-200 rounded-md  outline-none 
              ${modalLoading && "bg-gray-100 cursor-not-allowed"}`}
              placeholder="Enter team name"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Description</label>
            <textarea
              name="description"
              value={inputData.description}
              disabled={modalLoading}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-2 bg-gray-200 rounded-md outline-none 
              ${modalLoading && "bg-gray-100 cursor-not-allowed"}`}
              placeholder="Short team description"
              rows="3"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={modalLoading}
              onClick={() => !modalLoading && setOpen(false)}
              className={`px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer
              ${modalLoading && "opacity-40 cursor-not-allowed"}`}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={modalLoading}
              className={`px-4 py-2 text-sm rounded-md text-white cursor-pointer
              ${modalLoading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {modalLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : mode === "update" ? (
                "Update Team"
              ) : (
                "Create Team"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
