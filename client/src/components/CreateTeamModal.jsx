import React from "react";
import { X } from "lucide-react";

export default function CreateTeamModal({ open, setOpen }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop:blur-none">

      {/* Background blur overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      ></div>

      {/* Modal Box */}
      <div className="relative bg-white w-[90%] sm:w-[420px] rounded-lg shadow-lg p-6 animate-fadeIn">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Create New Team</h2>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-700">Team Name</label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 ring-blue-500 outline-none"
              placeholder="Enter team name"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Description</label>
            <textarea
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 ring-blue-500 outline-none"
              placeholder="Short team description"
              rows="3"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm rounded-md border bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>

            <button className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700">
              Create Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
