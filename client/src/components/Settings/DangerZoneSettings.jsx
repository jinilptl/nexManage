import React from "react";
import SettingsCard from "./SettingsCard";

export default function DangerZoneSettings() {
  return (
    <div className="bg-white border border-red-200 rounded-xl p-5 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
        <p className="text-sm text-gray-500">
          These actions are permanent and cannot be undone.
        </p>
      </div>

      <button
        onClick={() => alert("Workspace Deleted ❌ (Dummy)")}
        className="bg-red-600 text-white px-4 py-2 mr-5 rounded-lg text-sm font-medium hover:bg-red-700 transition"
      >
        Delete Workspace
      </button>

      <button
        onClick={() => alert("Account Deleted ❌ (Dummy)")}
        className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition"
      >
        Delete Account
      </button>
    </div>
  );
}
