import React, { useEffect } from "react";
import { X } from "lucide-react";
import {
  createTeamService,
  updateTeamService,
} from "../../../services/teamsOperations/teamsServices";
import { useDispatch, useSelector } from "react-redux";
import ModalSmallLoader from "../../Lodders/ModalSmallLoader"; 

export default function CreateTeamModal({ open, setOpen, mode }) {
  if (!open) return null;

  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  // 🔥 Only modal-specific loaders (perfect for modals)
  const creating = useSelector((state) => state.teams.actions.creatingTeam);
  const updating = useSelector((state) => state.teams.actions.updatingTeam);

  const modalLoading = creating || updating; // merged modal loading state

  const teamdata = useSelector((state) => state.teams.selectedTeam.data);

  const [inputData, setInputData] = React.useState({
    teamName: "",
    description: "",
  });

  // PREFILL IN UPDATE MODE
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

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0  bg-black/40 backdrop-blur-sm"
        onClick={() => !modalLoading && setOpen(false)}
      />

      {/* MODAL BOX */}
      <div className="relative bg-white w-[90%] sm:w-[420px] rounded-lg shadow-lg p-6 animate-fadeIn">

        {/* CLOSE BUTTON */}
        <button
          disabled={modalLoading}
          onClick={() => !modalLoading && setOpen(false)}
          className={`absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100 
          ${modalLoading && "opacity-40 cursor-not-allowed"}`}
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* HEADER */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {mode === "update" ? "Update Team" : "Create New Team"}
        </h2>

        {/* SMALL MODAL LOADER */}
        {modalLoading && <ModalSmallLoader />}

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* TEAM NAME */}
          <div>
            <label className="text-sm text-gray-700">Team Name</label>
            <input
              type="text"
              name="teamName"
              value={inputData.teamName}
              disabled={modalLoading}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 ring-blue-500 outline-none 
              ${modalLoading && "bg-gray-100 cursor-not-allowed"}`}
              placeholder="Enter team name"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm text-gray-700">Description</label>
            <textarea
              name="description"
              value={inputData.description}
              disabled={modalLoading}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 ring-blue-500 outline-none 
              ${modalLoading && "bg-gray-100 cursor-not-allowed"}`}
              placeholder="Short team description"
              rows="3"
            />
          </div>

          {/* FOOTER BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={modalLoading}
              onClick={() => !modalLoading && setOpen(false)}
              className={`px-4 py-2 text-sm rounded-md border bg-gray-100 hover:bg-gray-200 
              ${modalLoading && "opacity-40 cursor-not-allowed"}`}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={modalLoading}
              className={`px-4 py-2 text-sm rounded-md text-white 
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
