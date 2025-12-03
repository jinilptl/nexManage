import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function ProjectModal({
  open,
  onClose,
  mode = "create", // "create" | "edit"
  initialData = {},
  teamsList = [],
  onSubmit,
}) {
  const isEdit = mode === "edit";

  // --------------------------
  // Form State
  // --------------------------
  const [form, setForm] = useState({
    projectName: "",
    description: "",
    projectType: "team", // team | personal | mixed
    teams: [],
  });

  // --------------------------
  // Prefill in edit mode
  // --------------------------
  useEffect(() => {
    if (isEdit && initialData) {
      setForm({
        projectName: initialData.projectName || "",
        description: initialData.description || "",
        projectType: initialData.projectType || "team",
        teams: initialData.teams || [],
      });
    }
  }, [isEdit, initialData]);

  // --------------------------
  // Handle input
  // --------------------------
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTeam = (teamId) => {
    setForm((prev) => {
      const selected = prev.teams.includes(teamId)
        ? prev.teams.filter((id) => id !== teamId)
        : [...prev.teams, teamId];

      return { ...prev, teams: selected };
    });
  };

  // --------------------------
  // Submit handler
  // --------------------------
  const handleSubmit = () => {
    onSubmit(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4  md:0 pt-20">
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

        {/* FORM BODY */}
        <div className="space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-sm mb-1">Project Name</label>
            <input
              type="text"
              value={form.projectName}
              onChange={(e) => updateField("projectName", e.target.value)}
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 ring-blue-500"
              placeholder="Enter project name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 ring-blue-500"
              placeholder="Short description..."
              rows={3}
            />
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-sm mb-1">Project Type</label>
            <select
              value={form.projectType}
              onChange={(e) => updateField("projectType", e.target.value)}
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 ring-blue-500"
            >
              <option value="team">Team Project</option>
              <option value="personal">Personal Project</option>
              <option value="mixed">Mixed Project</option>
            </select>
          </div>

          {/* Teams (only when not personal) */}
          {form.projectType !== "personal" && (
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
                      checked={form.teams.includes(team._id)}
                      onChange={() => toggleTeam(team._id)}
                    />
                    <span>{team.teamName}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end mt-6 gap-3">
          <button
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEdit ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
