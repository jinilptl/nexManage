import { useState } from "react";

import SettingsLayout from "../../components/Settings/SettingsLayout";
import SettingsSidebar from "../../components/Settings/SettingsSidebar";
import AccountSettings from "../../components/Settings/AccountSettings";
import AdminSettings from "../../components/Settings/AdminSettings";
import SecuritySettings from "../../components/Settings/SecuritySettings";
import NotificationSettings from "../../components/Settings/NotificationSettings";
import AppearanceSettings from "../../components/Settings/AppearanceSettings";
import BillingSettings from "../../components/Settings/BillingSettings";
import DangerZoneSettings from "../../components/Settings/DangerZoneSettings";

export default function SettingsPage() {
  const tabs = [
    { key: "account", label: "Account Settings" },
    // { key: "admin", label: "Admin Settings" },
    { key: "security", label: "Security" },
    // { key: "notifications", label: "Notifications" },
    // { key: "appearance", label: "Appearance" },
    // { key: "billing", label: "Billing" },
    // { key: "danger", label: "Danger Zone" },
  ];

  const [activeTab, setActiveTab] = useState("account");

  return (
    <SettingsLayout
      title="Settings"
      subtitle="Manage your account"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <SettingsSidebar
            tabs={tabs}
            activeTab={activeTab}
            onChangeTab={setActiveTab}
          />
        </div>

        <div className="lg:col-span-9 space-y-6">
          {activeTab === "account" && <AccountSettings />}
          {/* {activeTab === "admin" && <AdminSettings />} */}
          {activeTab === "security" && <SecuritySettings />}
          {/* {activeTab === "notifications" && <NotificationSettings />} */}
          {/* {activeTab === "appearance" && <AppearanceSettings />} */}
          {/* {activeTab === "billing" && <BillingSettings />} */}
          {/* {activeTab === "danger" && <DangerZoneSettings />} */}
        </div>
      </div>
    </SettingsLayout>
  );
}
