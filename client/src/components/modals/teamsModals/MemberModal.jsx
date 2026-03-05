import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTeamMemberService,
  updateTeamMemberService,
} from "../../../services/teamsOperations/teamsServices";
import { fetchAllUsers } from "../../../services/usersOperations/usersServices";
import ButtonLoader from "../../Lodders/ButtonLoader";
import useScrollLock from "../../../hooks/useScrollLock";

export default function MemberModal({
  open,
  mode = "add",
  onClose,
  member,
  setMember,
}) {
  const dispatch = useDispatch();

  const selectedTeamId = useSelector((state) => state.teams.selectedTeam.id);
  const token = useSelector((state) => state.auth.token);

  const adding = useSelector((state) => state.teams.actions.addingMember);
  const updating = useSelector((state) => state.teams.actions.updatingMember);

  const allUsers = useSelector((state) => state.users.list);
  const teamMembers = useSelector((state) => state.teams.teamMembers.list);

  const loading = mode === "add" ? adding : updating;

  useEffect(() => {
    if (mode === "add" && (!allUsers || allUsers.length === 0) && open) {
      dispatch(fetchAllUsers(token));
    }
  }, [mode, allUsers, dispatch, token, open]);

  const [inputValue, setInputValue] = useState({
    email: "",
    roleInTeam: "member",
    status: "active",
  });

  useEffect(() => {
    if (mode === "update" && member) {
      setInputValue({
        email: member.user?.email || "",
        roleInTeam: member.roleInTeam,
        status: member.status,
      });
    }
  }, [mode, member]);

  const handleChange = (e) => {
    setInputValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddMember = (formData) => {
    dispatch(addTeamMemberService(selectedTeamId, formData, token, onClose));
  };

  const handleUpdateMember = (formData) => {
    dispatch(
      updateTeamMemberService(
        selectedTeamId,
        member.user._id,
        { roleInTeam: formData.roleInTeam, status: formData.status },
        token,
        onClose,
        setMember,
      ),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    if (mode === "add") handleAddMember(inputValue);
    if (mode === "update") handleUpdateMember(inputValue);
  };

  useScrollLock(open);

  if (!open) return null;

  if (!selectedTeamId) {
    return null;
  }

  const availableUsers =
    allUsers?.filter(
      (u) => !teamMembers.some((tm) => tm.user?._id === u._id),
    ) || [];

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm modal-backdrop-enter"
        onClick={() => !loading && onClose(false)}
      />

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-4 sm:p-6 modal-content-enter">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {mode === "add" ? "Add Member" : "Update Member"}
          </h2>

          <button
            disabled={loading}
            onClick={() => !loading && onClose(false)}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer ${loading && "opacity-40 cursor-not-allowed"
              }`}
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "add" && (
            <div>
              <label className="text-sm text-gray-600">Select Member</label>
              <select
                name="email"
                value={inputValue.email}
                onChange={handleChange}
                disabled={loading}
                className={`w-full mt-1 px-3 py-2 bg-gray-200 rounded-md outline-none cursor-pointer
                  ${loading && "opacity-50 cursor-not-allowed"}`}
              >
                <option value="">Select a user...</option>
                {availableUsers.map((user) => (
                  <option key={user._id} value={user.email}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-sm text-gray-600">Role in Team</label>
            <select
              name="roleInTeam"
              value={inputValue.roleInTeam}
              onChange={handleChange}
              disabled={loading}
              className={`w-full mt-1 px-3 py-2 bg-gray-200 rounded-md outline-none 
                ${loading && "opacity-50 cursor-not-allowed"}`}
            >
              <option value="team lead">Team Lead</option>
              <option value="developer">Developer</option>
              <option value="tester">Tester</option>
              <option value="manager">Manager</option>
              <option value="designer">Designer</option>
              <option value="QA">QA</option>
              <option value="member">Member</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Member Status</label>
            <select
              name="status"
              value={inputValue.status}
              onChange={handleChange}
              disabled={loading}
              className={`w-full mt-1 px-3 py-2 bg-gray-200 rounded-md outline-none 
                ${loading && "opacity-50 cursor-not-allowed"}`}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => !loading && onClose(false)}
              className={`px-4 py-2 text-sm cursor-pointer font-medium bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors
                ${loading && "opacity-50 cursor-not-allowed"}`}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium cursor-pointer rounded-lg text-white flex items-center gap-2 transition-colors
                ${loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading ? (
                <>
                  <ButtonLoader />
                  Processing…
                </>
              ) : mode === "add" ? (
                "Add Member"
              ) : (
                "Update Member"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
