import React, { useState } from "react";
import SettingsCard from "./SettingsCard";
import { useSelector } from "react-redux";

export default function AccountSettings() {
 const user= useSelector((state)=>state.auth.user);

 console.log("user is --> ",user);
 

  const role = user?.role === "admin"||"super_admin" ? "Administrator" : "User";

//   const handleSave = () => alert("Account Settings Saved ✅ (Dummy)");

  return (
    <SettingsCard
      title="Account Settings"
      subtitle="Update your personal profile information"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Full Name" value={user?.name.toUpperCase()}  />
        <InputField label="Email Address" value={user?.email}  />
        {/* <InputField label="Phone Number" value={user?.phone} onChange={setPhone} /> */}

        <div>
          <label className="text-sm font-medium text-gray-700">Role</label>
          <input
            value={role}
            disabled
            className="mt-1 w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
       
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          Save Account Settings
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
        readOnly
        disabled
        className="mt-1 w-full border border-gray-300  bg-gray-100  rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={`Enter ${label}`}
      />
    </div>
  );
}
