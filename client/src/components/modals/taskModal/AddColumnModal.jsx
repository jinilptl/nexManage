import React, { useState } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { addTaskStatusesIntoProjectService } from "../../../services/projectsOperations/projectsServices";

export default function AddColumnModal({ onClose,projectId,token }) {
  const [key, setKey] = useState("");
  const [label, setLabel] = useState("");
  const dispatch=useDispatch()

  

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      key:key.trim().toLowerCase(),
      label,
    };
       
    dispatch(addTaskStatusesIntoProjectService(payload,projectId,token))
    

    onClose();
  };

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm modal-backdrop-enter"
        onClick={onClose}
      />

      {/* MODAL BOX */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-4 sm:p-6 modal-content-enter">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Add Column</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key
            </label>
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label
            </label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Column
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
