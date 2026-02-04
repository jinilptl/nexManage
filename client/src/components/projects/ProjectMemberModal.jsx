import React, { useEffect, useState } from "react";
import { X, Mail, UserCog } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import ButtonLoader from "../Lodders/ButtonLoader";

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

  // Loaders from slice
  const adding = useSelector((state) => state.projects.actions.addingMember);
  const updating = useSelector((state) => state.projects.actions.updatingMember);

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
      if (!email.trim()) return toast.error("Please enter email");

      dispatch(
        addProjectMemberService(
          projectId,
          { email, roleInProject: role },
          token,
          onClose
        )
      );
    } else {
      dispatch(
        updateProjectMemberService(
          projectId,
          member.user._id,
          { roleInProject: role },
          token,
          onClose
        )
      );
    }
  };

  const isBusy = adding || updating;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 relative animate-slideUp">
        
        {/* Close */}
        <button
          className="absolute top-3 right-3 p-1 rounded-lg hover:bg-gray-100"
          onClick={onClose}
          disabled={isBusy}
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold mb-2">
          {mode === "add" ? "Add Member" : "Update Member"}
        </h2>

        <div className="space-y-5">
          
          {mode === "add" && (
            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="relative mt-1">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  disabled={isBusy}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300  rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            </div>
          )}

          {/* Email (disabled in edit) */}
          {mode === "edit" && (
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                disabled
                value={email}
                className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-sm cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
          )}

          {/* Role */}
          <div>
            <label className="text-sm font-medium flex items-center gap-1">
              <UserCog className="w-4 h-4" /> Role
            </label>
            <select
              disabled={isBusy}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              {roleOptions.map((r) => (
                <option key={r} value={r}>
                  {r.replace(/-/g, " ").toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            disabled={isBusy}
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            disabled={isBusy}
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm flex items-center gap-2 hover:bg-blue-700"
          >
            {isBusy ? <ButtonLoader /> : mode === "add" ? "Add Member" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
