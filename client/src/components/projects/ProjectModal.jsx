import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createProjectService } from "../../services/projectsOperations/projectsServices";

export default function ProjectModal({
  open,
  onClose,
  mode = "create", // "create" | "edit"
  initialData = {},
  teamsList = [],
}) {
  const isEdit = mode === "edit";
  // console.log(teamsList);

  const {token}=useSelector((state)=>state.auth)

  // console.log("token in project", token);
  

  const dispatch=useDispatch()

  

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    projectType: "personal",
    teams: [],
  });

  const handleOnchnage = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const toggleTeam = (teamId) => {
    setFormData((prev) => {
      let selectedTeam = prev.teams.includes(teamId)
        ? prev.teams.filter((team) => team !== teamId)
        : [...prev.teams, teamId];

      console.log("selected teams is --> ", selectedTeam);

      return { ...prev, teams: selectedTeam };
    });


  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    dispatch(createProjectService(formData,token,onClose))

    setFormData({
    projectName: "",
    description: "",
    projectType: "personal",
    teams: [],
  })

  };


  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4  md:pt-0 pt-20">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 animate-fadeIn">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Update Project" : "Create Project"}
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* formData BODY */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Project Name */}
          <div>
            <label className="block text-sm mb-1">Project Name</label>
            <input
              type="text"
              value={formData.projectName}
              onChange={handleOnchnage}
              required
              name="projectName"
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 ring-blue-500"
              placeholder="Enter project name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={handleOnchnage}
              name="description"
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 ring-blue-500"
              placeholder="Short description..."
              rows={3}
            />
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-sm mb-1">Project Type</label>
            <select
              value={formData.projectType}
              onChange={handleOnchnage}
              name="projectType"
              required
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 ring-blue-500"
            >
              <option value="team">Team Project</option>
              <option value="personal">Personal Project</option>
              <option value="mixed">Mixed Project</option>
            </select>
          </div>

          {/* Teams (only when not personal) */}
          {formData.projectType !== "personal" && (
            <div>
              <label className="block text-sm mb-2">Select Teams</label>

              <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-3">
                {teamsList.length === 0 && (
                  <p className="text-sm text-gray-500">No teams found</p>
                )}

                {teamsList.map((team) => (
                  <label
                    key={team._id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.teams.includes(team._id)}
                      onChange={() => toggleTeam(team._id)}
                    />
                    <span>{team.teamName}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* buttons */}
          <div className="flex justify-end mt-6 gap-3">
            <button
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
