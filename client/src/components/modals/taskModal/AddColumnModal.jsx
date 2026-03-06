import React, { useState } from "react";
import { X, Columns, Hash, Tag, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { addTaskStatusesIntoProjectService } from "../../../services/projectsOperations/projectsServices";
import useScrollLock from "../../../hooks/useScrollLock";

export default function AddColumnModal({ onClose, projectId, token }) {
  const [key, setKey] = useState("");
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const dispatch = useDispatch();

  useScrollLock(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!key.trim() || !label.trim()) return;
    setBusy(true);
    const payload = { key: key.trim().toLowerCase(), label };
    dispatch(addTaskStatusesIntoProjectService(payload, projectId, token));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-linear-to-br from-blue-600 via-blue-700 to-indigo-700 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
              <Columns size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm">Add Column</h2>
              <p className="text-blue-200 text-xs">Create a new Kanban column</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
              <Hash size={13} className="text-gray-400" />
              Key <span className="text-red-500">*</span>
            </label>
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="e.g. in_review"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              required
            />
            <p className="text-[11px] text-gray-400 mt-1">Used internally — lowercase, no spaces</p>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
              <Tag size={13} className="text-gray-400" />
              Label <span className="text-red-500">*</span>
            </label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. In Review"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              required
            />
            <p className="text-[11px] text-gray-400 mt-1">Displayed in the Kanban board</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Columns size={14} />}
              Add Column
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
