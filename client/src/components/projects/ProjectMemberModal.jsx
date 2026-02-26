import React, { useEffect, useState } from "react";
import { X, UserCog } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import ButtonLoader from "../Lodders/ButtonLoader";
import { fetchAllUsers } from "../../services/usersOperations/usersServices";

import {
  addProjectMemberService,
  updateProjectMemberService,
} from "../../services/projectsOperations/projectsServices";

export default function ProjectMemberModal({
  open,
  onClose,
  mode = "add",
  member = null,
}) {
  const dispatch = useDispatch();
  const projectId = useSelector((state) => state.projects.selectedProject.id);
  const token = useSelector((state) => state.auth.token);

  const adding = useSelector((state) => state.projects.actions.addingMember);
  const updating = useSelector(
    (state) => state.projects.actions.updatingMember,
  );

  const allUsers = useSelector((state) => state.users.list);
  const projectMembers = useSelector(
    (state) => state.projects.projectMembers.list,
  );

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("contributor");

  useEffect(() => {
    if (mode === "edit" && member) {
      setEmail(member.user?.email || "");
      setRole(member.roleInProject || "contributor");
    } else {
      setEmail("");
      setRole("contributor");
    }
  }, [mode, member]);

  useEffect(() => {
    if (mode === "add" && (!allUsers || allUsers.length === 0)) {
      dispatch(fetchAllUsers(token));
    }
  }, [mode, allUsers, dispatch, token]);

  const availableUsers =
    allUsers?.filter(
      (u) => !projectMembers.some((pm) => pm.user?._id === u._id),
    ) || [];

  if (!open) return null;

  const roleOptions = [
    "project-manager",
    "developer",
    "tester",
    "designer",
    "qa",
    "reviewer",
    "contributor",
  ];

  const handleSubmit = () => {
    if (mode === "add") {
      if (!email.trim()) return toast.error("Please select a user");

      dispatch(
        addProjectMemberService(
          projectId,
          { email, roleInProject: role },
          token,
          onClose,
        ),
      );
    } else {
      dispatch(
        updateProjectMemberService(
          projectId,
          member.user._id,
          { roleInProject: role },
          token,
          onClose,
        ),
      );
    }
  };

  const isBusy = adding || updating;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm modal-backdrop-enter"
        onClick={() => !isBusy && onClose()}
      />

      <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl p-4 sm:p-6 modal-content-enter">
        <button
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onClose}
          disabled={isBusy}
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {mode === "add" ? "Add Member" : "Update Member"}
        </h2>

        <div className="space-y-5">
          {mode === "add" && (
            <div>
              <label className="text-sm font-medium">Select Member</label>
              <div className="relative mt-1">
                <select
                  disabled={isBusy}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-200 rounded-md text-sm outline-none cursor-pointer"
                >
                  <option value="">Select a user...</option>
                  {availableUsers.map((user) => (
                    <option key={user._id} value={user.email}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {mode === "edit" && (
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                disabled
                value={email}
                className="w-full px-3 py-2 bg-gray-200 rounded-md text-sm cursor-not-allowed outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium flex items-center gap-1">
              <UserCog className="w-4 h-4" /> Role
            </label>
            <select
              disabled={isBusy}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-gray-200 rounded-md text-sm outline-none "
            >
              {roleOptions.map((r) => (
                <option key={r} value={r}>
                  {r.replace(/-/g, " ").toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            disabled={isBusy}
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            disabled={isBusy}
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBusy ? (
              <ButtonLoader />
            ) : mode === "add" ? (
              "Add Member"
            ) : (
              "Update"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
