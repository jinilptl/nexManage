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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[360px] bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Column</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Key</label>
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Label</label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-1.5 rounded"
          >
            Add Column
          </button>
        </form>
      </div>
    </div>
  );
}
