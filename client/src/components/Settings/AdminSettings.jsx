import React, { useState } from "react";
import SettingsCard from "./SettingsCard";
import SettingToggle from "./SettingToggle";

export default function AdminSettings() {
  const [companyName, setCompanyName] = useState("NexManage Pvt Ltd");
  const [workspaceName, setWorkspaceName] = useState("NexManage Workspace");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [language, setLanguage] = useState("English");

  const [allowMemberInvite, setAllowMemberInvite] = useState(true);
  const [allowProjectCreate, setAllowProjectCreate] = useState(true);
  const [requireApproval, setRequireApproval] = useState(false);

  const handleSave = () => alert("Admin Settings Saved ✅ (Dummy)");

  return (
    <SettingsCard
      title="Admin Settings"
      subtitle="Manage workspace rules and admin controls"
    >
      <div className="border border-gray-200 rounded-xl p-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">
          Workspace Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Company Name"
            value={companyName}
            onChange={setCompanyName}
          />
          <InputField
            label="Workspace Name"
            value={workspaceName}
            onChange={setWorkspaceName}
          />

          <div>
            <label className="text-sm font-medium text-gray-700">
              Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Gujarati">Gujarati</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl p-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">
          Permissions & Rules
        </h3>

        <SettingToggle
          title="Allow members to invite others"
          desc="Members can send invite links to new users"
          enabled={allowMemberInvite}
          onToggle={() => setAllowMemberInvite((p) => !p)}
        />

        <SettingToggle
          title="Allow members to create projects"
          desc="Members can create new projects in workspace"
          enabled={allowProjectCreate}
          onToggle={() => setAllowProjectCreate((p) => !p)}
        />

        <SettingToggle
          title="Require admin approval for new members"
          desc="Invited members will need approval before joining"
          enabled={requireApproval}
          onToggle={() => setRequireApproval((p) => !p)}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          Save Admin Settings
        </button>
      </div>
    </SettingsCard>
  );
}

function InputField({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        value={value}
        disabled
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
