import React from "react";
import SettingsCard from "./SettingsCard";

export default function BillingSettings() {
  return (
    <SettingsCard
      title="Billing"
      subtitle="Manage your subscription and invoices (dummy)"
    >
      <div className="border border-gray-200 rounded-xl p-4 space-y-2">
        <p className="text-sm text-gray-900 font-medium">Current Plan</p>
        <p className="text-sm text-gray-600">Free Plan</p>
        <p className="text-xs text-gray-500">
          Upgrade to unlock unlimited projects and analytics.
        </p>
      </div>

      <button
        onClick={() => alert("Upgrade Clicked 💳 (Dummy)")}
        className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition"
      >
        Upgrade Plan
      </button>
    </SettingsCard>
  );
}
