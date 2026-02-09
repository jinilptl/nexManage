import { useEffect, useState } from "react";
import SettingsCard from "./SettingsCard";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../services/usersOperations/usersServices";
import toast from "react-hot-toast";

export default function AccountSettings() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const role = user?.role === "member" ? "User" : "Administrator";
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.name === user.name && formData.email === user.email) {
      toast("No changes to update");
      setIsEditing(false);
      return;
    }

    try {
      setLoading(true);

      await dispatch(
        updateUser({
          userId: user._id,
          data: formData,
        }),
      ).unwrap();

      dispatch({
        type: "auth/setUser",
        payload: {
          ...user,
          ...formData,
        },
      });

      toast.success("User updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error(error?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsCard
      title="Account Settings"
      subtitle="Update your personal profile information"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Full Name"
          value={formData.name}
          disabled={!isEditing || loading}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <InputField
          label="Email Address"
          value={formData.email}
          disabled={!isEditing || loading}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <div>
          <label className="text-sm font-medium text-gray-700">Role</label>
          <input
            value={role}
            disabled
            className="mt-1 w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        {isEditing && (
          <button
            onClick={() => {
              setIsEditing(false);
              setFormData({
                name: user.name,
                email: user.email,
              });
            }}
            className="border px-4 py-2 rounded-lg text-sm"
          >
            Cancel
          </button>
        )}

        <button
          type="button"
          onClick={isEditing ? handleSubmit : () => setIsEditing(true)}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : isEditing
              ? "Save Account Settings"
              : "Update Account Settings"}
        </button>
      </div>
    </SettingsCard>
  );
}

function InputField({ label, value, onChange, disabled }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none
          ${
            disabled
              ? "bg-gray-100 border-gray-300 text-gray-500"
              : "bg-white border-gray-300 focus:ring-2 focus:ring-blue-500"
          }`}
        placeholder={`Enter ${label}`}
      />
    </div>
  );
}
