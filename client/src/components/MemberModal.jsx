import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTeamMemberService } from "../services/teamsOperations/teamsServices";

export default function MemberModal({ open, mode = "add", onClose }) {
  if (!open) return null;
  const dispatch = useDispatch();

  const selectedTeamId = useSelector((state) => state.teams.selectedTeam.id);
  const token = useSelector((state) => state.auth.token);

  const [inputValue, setInputValue] = useState({
    email: "",
    roleInTeam: "member",
    status: "active",
  });

  const handleChnage = (e) => {
    setInputValue((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleAddMember = (formData) => {
    dispatch(addTeamMemberService(selectedTeamId, formData, token, onClose));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("input value data is ----> ", inputValue);
    if (mode === "add") {
      handleAddMember(inputValue);
    } else {
      log("update member logic to be added");
    }
  };
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      {/* MODAL BOX */}
      <div className="bg-white rounded-lg shadow-lg w-[95%] max-w-md p-6 animate-fadeIn">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {mode === "add" ? "Add Member" : "Update Member"}
          </h2>

          <button
            onClick={() => onClose(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* FORM UI */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* EMAIL FIELD (ADD MODE ONLY) */}
          {mode === "add" && (
            <div>
              <label className="text-sm text-gray-600">Member Email</label>
              <input
                type="email"
                value={inputValue.email}
                onChange={handleChnage}
                name="email"
                placeholder="Enter member email"
                required
                className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 ring-blue-500 outline-none"
              />
            </div>
          )}

          {/* ROLE FIELD */}
          <div>
            <label className="text-sm text-gray-600">Role in Team</label>
            <select
              onChange={handleChnage}
              value={inputValue.roleInTeam}
              name="roleInTeam"
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 ring-blue-500 outline-none"
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
              onChange={handleChnage}
              value={inputValue.status}
              name="status"
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 ring-blue-500 outline-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* FOOTER BUTTONS */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {mode === "add" ? "Add Member" : "Update Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
