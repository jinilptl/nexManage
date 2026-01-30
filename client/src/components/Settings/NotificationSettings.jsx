import React, { useState } from "react";
import SettingsCard from "./SettingsCard";
import SettingToggle from "./SettingToggle";

export default function NotificationSettings() {
  const [emailNoti, setEmailNoti] = useState(true);
  const [taskNoti, setTaskNoti] = useState(true);
  const [projectNoti, setProjectNoti] = useState(false);

  return (
    <SettingsCard
      title="Notifications"
      subtitle="Control how you receive notifications"
    >
      <SettingToggle
        title="Email Notifications"
        desc="Receive updates via email"
        enabled={emailNoti}
        onToggle={() => setEmailNoti((p) => !p)}
      />

      <SettingToggle
        title="Task Notifications"
        desc="Get notified when tasks are assigned or updated"
        enabled={taskNoti}
        onToggle={() => setTaskNoti((p) => !p)}
      />

      <SettingToggle
        title="Project Notifications"
        desc="Updates about projects status and changes"
        enabled={projectNoti}
        onToggle={() => setProjectNoti((p) => !p)}
      />

      <div className="flex justify-end">
        <button
          onClick={() => alert("Notification Settings Saved ✅ (Dummy)")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          Save Notification Settings
        </button>
      </div>
    </SettingsCard>
  );
}
