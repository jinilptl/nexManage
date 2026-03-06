import React, { useEffect } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import useScrollLock from "../../../hooks/useScrollLock";

export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) {
  useScrollLock(open);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!loading ? onCancel : undefined}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-red-500 to-orange-500" />

        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} className="text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                id="confirm-modal-title"
                className="text-base font-bold text-gray-900 leading-tight"
              >
                {title}
              </h3>
              {message && (
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{message}</p>
              )}
            </div>
            <button
              onClick={onCancel}
              disabled={loading}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-40 shrink-0"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-200"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Please wait…
                </>
              ) : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
