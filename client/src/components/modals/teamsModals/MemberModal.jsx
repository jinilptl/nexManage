import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTeamMemberService,
  updateTeamMemberService,
} from "../../../services/teamsOperations/teamsServices";
import ButtonLoader from "../../Lodders/ButtonLoader";

export default function MemberModal({
  open,
  mode = "add",
  onClose,
  member,
  setMember,
}) {
  if (!open) return null;

  const dispatch = useDispatch();

  const selectedTeamId = useSelector((state) => state.teams.selectedTeam.id);
  const token = useSelector((state) => state.auth.token);

  // ⭐ CORRECT loaders
  const adding = useSelector((state) => state.teams.actions.addingMember);
  const updating = useSelector((state) => state.teams.actions.updatingMember);

  // current loader based on mode
  const loading = mode === "add" ? adding : updating;

  const [inputValue, setInputValue] = useState({
    email: "",
    roleInTeam: "member",
    status: "active",
  });

  useEffect(() => {
    if (mode === "update" && member) {
      setInputValue({
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
        setMember
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    if (mode === "add") handleAddMember(inputValue);
    if (mode === "update") handleUpdateMember(inputValue);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-5000 flex items-center justify-center">

      {/* MODAL BOX */}
      <div className="bg-white rounded-lg shadow-lg w-[95%] max-w-md p-6 animate-fadeIn">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {mode === "add" ? "Add Member" : "Update Member"}
          </h2>

          <button
            disabled={loading}
            onClick={() => !loading && onClose(false)}
            className={`text-gray-500 hover:text-gray-700 ${
              loading && "opacity-40 cursor-not-allowed"
            }`}
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* EMAIL FIELD (Add only) */}
          {mode === "add" && (
            <div>
              <label className="text-sm text-gray-600">Member Email</label>
              <input
                type="email"
                value={inputValue.email}
                onChange={handleChange}
                name="email"
                placeholder="Enter member email"
                required
                disabled={loading}
                className={`w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 ring-blue-500 outline-none 
                  ${loading && "opacity-50 cursor-not-allowed"}`}
              />
            </div>
          )}

          {/* ROLE */}
          <div>
            <label className="text-sm text-gray-600">Role in Team</label>
            <select
              name="roleInTeam"
              value={inputValue.roleInTeam}
              onChange={handleChange}
              disabled={loading}
              className={`w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 ring-blue-500 outline-none 
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

          {/* STATUS */}
          <div>
            <label className="text-sm text-gray-600">Member Status</label>
            <select
              name="status"
              value={inputValue.status}
              onChange={handleChange}
              disabled={loading}
              className={`w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 ring-blue-500 outline-none 
                ${loading && "opacity-50 cursor-not-allowed"}`}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* FOOTER BUTTONS */}
          <div className="mt-6 flex items-center justify-end gap-3">

            <button
              type="button"
              disabled={loading}
              onClick={() => !loading && onClose(false)}
              className={`px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300 
                ${loading && "opacity-50 cursor-not-allowed"}`}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-sm rounded-md text-white flex items-center gap-2 
                ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
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
