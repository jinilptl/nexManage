import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ButtonLoader from "../Lodders/ButtonLoader";

import {
  createProjectService,
  updateProjectService,
} from "../../services/projectsOperations/projectsServices";

export default function ProjectModal({
  open,
  onClose,
  mode = "create",
  initialData = {},
  teamsList = [],
}) {
  const isEdit = mode === "edit";

  const dispatch = useDispatch();
  
  const token = useSelector((state) => state.auth.token);
  const projectId = useSelector((state) => state.projects.selectedProject.id);

  // Loaders
  const creating = useSelector((state) => state.projects.actions.creating);
  const updating = useSelector((state) => state.projects.actions.updating);

  const isBusy = creating || updating;

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    projectType: "personal",
    teams: [],
  });

  useEffect(() => {
    if (!open) return;

    if (isEdit && initialData) {
      setFormData({
        projectName: initialData.projectName ?? "",
        description: initialData.description ?? "",
        projectType: initialData.projectType ?? "personal",
        teams: initialData?.teams?.map((t) => t._id) ?? [],
      });
    } 
  }, [open, isEdit, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEdit) {
      dispatch(updateProjectService(projectId, formData, token, onClose));
    } else {
      dispatch(createProjectService(formData, token, onClose));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div
        className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 animate-fadeIn relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          disabled={isBusy}
          className={`absolute top-3 right-3 p-1 rounded-md ${
            isBusy ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold mb-4">
          {isEdit ? "Update Project" : "Create Project"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          <input
            disabled={isBusy}
            type="text"
            name="projectName"
            required
            value={formData.projectName}
            onChange={(e) =>
              setFormData({ ...formData, projectName: e.target.value })
            }
            className="w-full border rounded-md px-3 py-2"
            placeholder="Project Name"
          />

          <textarea
            disabled={isBusy}
            name="description"
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border rounded-md px-3 py-2"
            placeholder="Short description..."
          />

          <select
            disabled={isBusy}
            value={formData.projectType}
            onChange={(e) =>
              setFormData({
                ...formData,
                projectType: e.target.value,
                teams: e.target.value === "personal" ? [] : formData.teams,
              })
            }
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="team">Team Project</option>
            <option value="personal">Personal Project</option>
            <option value="mixed">Mixed Project</option>
          </select>

          {/* TEAM CHECKBOXES */}
          {formData.projectType !== "personal" && (
            <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
              {teamsList.length === 0 && (
                <p className="text-sm text-gray-500">No teams found</p>
              )}

              {teamsList.map((team) => (
                <label key={team._id} className="flex items-center gap-2">
                  <input
                    disabled={isBusy}
                    type="checkbox"
                    checked={formData.teams.includes(team._id)}
                    onChange={() => {
                      setFormData((prev) => {
                        const exists = prev.teams.includes(team._id);
                        return {
                          ...prev,
                          teams: exists
                            ? prev.teams.filter((id) => id !== team._id)
                            : [...prev.teams, team._id],
                        };
                      });
                    }}
                  />

                  {team.teamName}
                </label>
              ))}
            </div>
          )}

          {/* FOOTER */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              disabled={isBusy}
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              Cancel
            </button>

            <button
              disabled={isBusy}
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
            >
              {isBusy ? <ButtonLoader /> : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
