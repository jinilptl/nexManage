import React, { useEffect, useState } from "react";
import { X, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ButtonLoader from "../Lodders/ButtonLoader";
import { fetchTeamsService } from "../../services/teamsOperations/teamsServices";
import { updateProjectService } from "../../services/projectsOperations/projectsServices";

export default function AddTeamToProjectModal({
    open,
    onClose,
    project,
}) {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const allTeams = useSelector((state) => state.teams.list);
    const updating = useSelector((state) => state.projects.actions.updating);

    const [selectedTeams, setSelectedTeams] = useState([]);
    const [availableTeams, setAvailableTeams] = useState([]);

    useEffect(() => {
        if (open) {
            if (!allTeams || allTeams.length === 0) {
                dispatch(fetchTeamsService(token));
            }
        }
    }, [open, allTeams, dispatch, token]);

    useEffect(() => {
        if (project && allTeams) {
            const currentTeamIds = project.teams?.map((t) => t._id) || [];
            const available = allTeams.filter(
                (t) => !currentTeamIds.includes(t._id) && t.status !== "archived"
            );
            setAvailableTeams(available);
            setSelectedTeams([]);
        }
    }, [project, allTeams]);

    useEffect(() => {
        if (open) {
            document.body.classList.add("modal-open");
            return () => document.body.classList.remove("modal-open");
        }
    }, [open]);

    const handleSubmit = () => {
        if (selectedTeams.length === 0) return;

        const currentTeamIds = project.teams?.map((t) => t._id) || [];
        const newTeamIds = [...currentTeamIds, ...selectedTeams];

        dispatch(
            updateProjectService(
                project._id,
                { teams: newTeamIds },
                token,
                onClose
            )
        );
    };

    const toggleTeam = (teamId) => {
        setSelectedTeams((prev) =>
            prev.includes(teamId)
                ? prev.filter((id) => id !== teamId)
                : [...prev, teamId]
        );
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm modal-backdrop-enter"
                onClick={() => !updating && onClose()}
            />

            {/* MODAL BOX */}
            <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl p-4 sm:p-6 modal-content-enter">
                {/* Close */}
                <button
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors disabled:opacity-50"
                    onClick={onClose}
                    disabled={updating}
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <Users size={20} />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Add Teams to Project
                    </h2>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                    Select teams to add to <strong>{project?.projectName}</strong>
                </p>

                {/* List */}
                <div className="space-y-2 max-h-60 overflow-y-auto mb-6 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    {availableTeams.length === 0 ? (
                        <p className="text-center text-sm text-gray-400 py-4">
                            All active teams are already added.
                        </p>
                    ) : (
                        availableTeams.map((team) => (
                            <label
                                key={team._id}
                                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedTeams.includes(team._id)
                                        ? "bg-blue-50 border-blue-200"
                                        : "bg-white border-gray-200 hover:border-blue-200"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                        checked={selectedTeams.includes(team._id)}
                                        onChange={() => toggleTeam(team._id)}
                                        disabled={updating}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">{team.teamName}</p>
                                        <p className="text-xs text-gray-500">{team.members?.length || 0} Members</p>
                                    </div>
                                </div>
                            </label>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3">
                    <button
                        disabled={updating}
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={updating || selectedTeams.length === 0}
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {updating ? <ButtonLoader /> : "Add Selected Teams"}
                    </button>
                </div>
            </div>
        </div>
    );
}
