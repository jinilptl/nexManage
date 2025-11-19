import React, { useEffect } from "react";
import { X } from "lucide-react";
import {
  createTeamService,
  updateTeamService,
} from "../../../services/teamsOperations/teamsServices";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ModalSmallLoader from "../../Lodders/ModalSmallLoader"; // ⭐ IMPORT SMALL LOADER

export default function CreateTeamModal({ open, setOpen, mode }) {
  if (!open) return null;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const teamdata = useSelector((state) => state.teams.selectedTeam.data);
  const loading = useSelector((state) => state.teams.loading); // ⭐ GET LOADING STATE

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => !loading && setOpen(false)}
      />

      {/* MODAL BOX */}
      <div className="relative bg-white w-[90%] sm:w-[420px] rounded-lg shadow-lg p-6 animate-fadeIn">

        {/* CLOSE BUTTON */}
        <button
          disabled={loading}
          onClick={() => !loading && setOpen(false)}
          className={`absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100 
          ${loading && "opacity-40 cursor-not-allowed"}`}
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* HEADER */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {mode === "update" ? "Update Team" : "Create New Team"}
        </h2>

        {/* SMALL LOADER */}
        {loading && <ModalSmallLoader />}

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* TEAM NAME */}
          <div>
            <label className="text-sm text-gray-700">Team Name</label>
            <input
              type="text"
              name="teamName"
              value={inputData.teamName}
              disabled={loading}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 ring-blue-500 outline-none 
              ${loading && "bg-gray-100 cursor-not-allowed"}`}
              placeholder="Enter team name"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm text-gray-700">Description</label>
            <textarea
              name="description"
              value={inputData.description}
              disabled={loading}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 ring-blue-500 outline-none 
              ${loading && "bg-gray-100 cursor-not-allowed"}`}
              placeholder="Short team description"
              rows="3"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => !loading && setOpen(false)}
              className={`px-4 py-2 text-sm rounded-md border bg-gray-100 hover:bg-gray-200 
              ${loading && "opacity-40 cursor-not-allowed"}`}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-sm rounded-md text-white 
              ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {loading ? (
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
