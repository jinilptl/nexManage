import React, { useState } from "react";
import SettingsCard from "./SettingsCard";
import SettingToggle from "./SettingToggle";

export default function AppearanceSettings() {
  const [theme, setTheme] = useState("light");
  const [compactMode, setCompactMode] = useState(false);

  return (
    <SettingsCard
      title="Appearance"
      subtitle="Customize theme and layout"
    >
      <div>
        <label className="text-sm font-medium text-gray-700">Theme</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System Default</option>
        </select>
      </div>

      <SettingToggle
        title="Compact Mode"
        desc="Reduce padding and spacing in UI"
        enabled={compactMode}
        onToggle={() => setCompactMode((p) => !p)}
      />

      <div className="flex justify-end">
        <button
          onClick={() => alert("Appearance Saved 🎨 (Dummy)")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          Save Appearance
        </button>
      </div>
    </SettingsCard>
  );
}
