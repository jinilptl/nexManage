import React, { useEffect, useState } from "react";
import {
  X,
  FolderOpen,
  User,
  Users,
  Shuffle,
  Search,
  Check,
  ChevronDown,
  Layers,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ButtonLoader from "../Lodders/ButtonLoader";

import {
  createProjectService,
  updateProjectService,
} from "../../services/projectsOperations/projectsServices";
import useScrollLock from "../../hooks/useScrollLock";

const TYPE_OPTIONS = [
  {
    value: "personal",
    label: "Personal",
    icon: User,
    description: "Solo workspace",
    color: "blue",
  },
  {
    value: "team",
    label: "Team",
    icon: Users,
    description: "Team collaboration",
    color: "violet",
  },
  {
    value: "mixed",
    label: "Mixed",
    icon: Shuffle,
    description: "Hybrid approach",
    color: "emerald",
  },
];

const colorMap = {
  blue: {
    selected:
      "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/30",
    icon: "bg-blue-100 text-blue-600",
    dot: "bg-blue-500",
  },
  violet: {
    selected:
      "border-violet-500 bg-violet-50 text-violet-700 ring-2 ring-violet-500/30",
    icon: "bg-violet-100 text-violet-600",
    dot: "bg-violet-500",
  },
  emerald: {
    selected:
      "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/30",
    icon: "bg-emerald-100 text-emerald-600",
    dot: "bg-emerald-500",
  },
};

function TypeCard({ option, selected, onClick, disabled }) {
  const Icon = option.icon;
  const colors = colorMap[option.color];
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`relative flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none ${selected
          ? colors.selected
          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
        }`}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${selected ? colors.icon : "bg-gray-100 text-gray-500"
          }`}
      >
        <Icon size={18} />
      </div>
      <span className="text-xs font-semibold leading-none">{option.label}</span>
      <span
        className={`text-[10px] leading-none ${selected ? "opacity-80" : "text-gray-400"
          }`}
      >
        {option.description}
      </span>
      {selected && (
        <span
          className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${colors.dot}`}
        />
      )}
    </button>
  );
}

function TeamPicker({ teamsList, selectedTeams, onChange, disabled }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = teamsList.filter((t) =>
    t.teamName.toLowerCase().includes(search.toLowerCase())
  );

  const selectedTeamObjects = teamsList.filter((t) =>
    selectedTeams.includes(t._id)
  );

  const toggle = (id) => {
    onChange(
      selectedTeams.includes(id)
        ? selectedTeams.filter((x) => x !== id)
        : [...selectedTeams, id]
    );
  };

  return (
    <div className="space-y-2">
      {selectedTeamObjects.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedTeamObjects.map((t) => (
            <span
              key={t._id}
              className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-medium rounded-full"
            >
              <Users size={11} />
              {t.teamName}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => toggle(t._id)}
                  className="ml-0.5 w-4 h-4 flex items-center justify-center rounded-full hover:bg-violet-200 transition-colors cursor-pointer"
                >
                  <X size={10} />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-gray-300 hover:bg-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
      >
        <span className="flex items-center gap-2 text-gray-500">
          <Users size={14} />
          {selectedTeamObjects.length === 0
            ? "Select teams..."
            : `${selectedTeamObjects.length} team${selectedTeamObjects.length > 1 ? "s" : ""} selected`}
        </span>
        <ChevronDown
          size={15}
          className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border border-gray-200 rounded-xl bg-white shadow-lg overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search teams..."
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-44 overflow-y-auto divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">
                No teams found
              </p>
            ) : (
              filtered.map((team) => {
                const isChecked = selectedTeams.includes(team._id);
                return (
                  <button
                    key={team._id}
                    type="button"
                    onClick={() => toggle(team._id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${isChecked
                          ? "bg-violet-600 border-violet-600"
                          : "border-gray-300"
                        }`}
                    >
                      {isChecked && <Check size={11} className="text-white" strokeWidth={3} />}
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                        <Users size={13} className="text-violet-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {team.teamName}
                        </p>
                        {team.members?.length !== undefined && (
                          <p className="text-[11px] text-gray-400">
                            {team.members.length} member
                            {team.members.length !== 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {filtered.length > 0 && (
            <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {selectedTeams.length} of {teamsList.length} selected
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !isBusy && onClose()}
      />

      <div
        className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-linear-to-br from-blue-600 via-blue-700 to-indigo-700 px-6 py-5 shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white leading-tight">
                  {isEdit ? "Update Project" : "Create New Project"}
                </h2>
                <p className="text-blue-200 text-xs mt-0.5">
                  {isEdit
                    ? "Update your project details below"
                    : "Fill in the details to get started"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isBusy}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-6 py-5 flex-1">
          <form id="project-form" className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Project Name <span className="text-red-500">*</span>
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
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
                placeholder="e.g. Marketing Dashboard Redesign"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none disabled:opacity-60"
                placeholder="Briefly describe the project goals and scope..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Type
              </label>
              <div className="flex gap-2">
                {TYPE_OPTIONS.map((opt) => (
                  <TypeCard
                    key={opt.value}
                    option={opt}
                    selected={formData.projectType === opt.value}
                    disabled={isBusy}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        projectType: opt.value,
                        teams:
                          opt.value === "personal" ? [] : formData.teams,
                      })
                    }
                  />
                ))}
              </div>
            </div>

            {formData.projectType !== "personal" && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Assign Teams
                  </label>
                  {formData.teams.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, teams: [] }))}
                      className="text-xs text-red-500 hover:text-red-600 font-medium cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <TeamPicker
                  teamsList={teamsList}
                  selectedTeams={formData.teams}
                  disabled={isBusy}
                  onChange={(ids) =>
                    setFormData((p) => ({ ...p, teams: ids }))
                  }
                />
              </div>
            )}
          </form>
        </div>

        <div className="shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50/60 flex justify-end gap-3">
          <button
            type="button"
            disabled={isBusy}
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            form="project-form"
            type="submit"
            disabled={isBusy}
            className="px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBusy ? (
              <ButtonLoader />
            ) : (
              <>
                {isEdit ? (
                  <>
                    <FolderOpen size={15} />
                    Update Project
                  </>
                ) : (
                  <>
                    <Layers size={15} />
                    Create Project
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
