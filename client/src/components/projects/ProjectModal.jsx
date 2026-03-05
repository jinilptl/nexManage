import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ButtonLoader from "../Lodders/ButtonLoader";

import {
  createProjectService,
  updateProjectService,
} from "../../services/projectsOperations/projectsServices";
import { fetchTeamsService } from "../../services/teamsOperations/teamsServices";
import useScrollLock from "../../hooks/useScrollLock";

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
  const teams = useSelector((state) => state.teams.list);
  const creating = useSelector((state) => state.projects.actions.creating);
  const updating = useSelector((state) => state.projects.actions.updating);

  const isBusy = creating || updating;

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    projectType: "personal",
    teams: [],
  });

  if (teamsList === undefined || teamsList === null || teamsList.length === 0) {
    teamsList = teams;
  }

  useEffect(() => {
    if (!open) return;

    if (isEdit && initialData) {
      setFormData({
        projectName: initialData.projectName ?? "",
        description: initialData.description ?? "",
        projectType: initialData.projectType ?? "personal",
        teams: initialData?.teams?.map((t) => t._id) ?? [],
      });
    } else {
      setFormData({
        projectName: "",
        description: "",
        projectType: "personal",
        teams: [],
      });
    }
  }, [open, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEdit) {
      dispatch(updateProjectService(projectId, formData, token, onClose));
    } else {
      dispatch(createProjectService(formData, token, onClose));
    }
  };

  useScrollLock(open);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm modal-backdrop-enter"
        onClick={() => !isBusy && onClose()}
      />

      <div
        className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl p-4 sm:p-6 modal-content-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          disabled={isBusy}
          className={`absolute top-4 right-4 p-2 cursor-pointer rounded-lg transition-colors ${isBusy ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {isEdit ? "Update Project" : "Create Project"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              disabled={isBusy}
              type="text"
              name="projectName"
              required
              value={formData.projectName}
              onChange={(e) =>
                setFormData({ ...formData, projectName: e.target.value })
              }
              className="w-full bg-gray-200 focus:outline-none rounded-md px-3 py-2"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              disabled={isBusy}
              name="description"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-gray-200 focus:outline-none rounded-md px-3 py-2"
              placeholder="Short description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Type
            </label>
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
              className="w-full bg-gray-200 focus:outline-none rounded-md px-3 py-2"
            >
              <option value="team">Team Project</option>
              <option value="personal">Personal Project</option>
              <option value="mixed">Mixed Project</option>
            </select>
          </div>

          {formData.projectType !== "personal" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Teams
              </label>
              <div className="bg-gray-200 focus:outline-none rounded-md p-3 max-h-32 overflow-y-auto">
                {teamsList.length === 0 && (
                  <p className="text-sm text-gray-500">No teams found</p>
                )}

                {teamsList.map((team) => (
                  <label
                    key={team._id}
                    className="flex items-center gap-2 mb-1"
                  >
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
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              disabled={isBusy}
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              disabled={isBusy}
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white cursor-pointer rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBusy ? <ButtonLoader /> : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
