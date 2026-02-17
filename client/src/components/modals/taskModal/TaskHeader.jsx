import { X, Pencil, Trash2 } from "lucide-react";

export default function TaskHeader({ task, canManage, onEdit, onDelete, onClose }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">

      {/* LEFT SIDE */}
      <div className="flex-1 min-w-0">
        <h2 className="text-xl sm:text-3xl font-extrabold text-gray-900 truncate tracking-tight">
          {task.title}
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase tracking-wider">
            Task ID
          </span>
          <p className="text-xs sm:text-sm font-medium text-gray-400">
            Task-{task._id.slice(-6).toUpperCase()}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2 shrink-0">
        {canManage && (
          <>
            <button
              onClick={onEdit}
              className="rounded-xl bg-indigo-50 text-indigo-600 cursor-pointer px-4 py-2 text-sm font-bold hover:bg-indigo-100 transition-all flex items-center gap-2"
            >
              <Pencil size={15} /> Edit
            </button>

            <button
              onClick={onDelete}
              className="rounded-xl bg-red-50 text-red-600 cursor-pointer px-4 py-2 text-sm font-bold hover:bg-red-100 transition-all flex items-center gap-2"
            >
              <Trash2 size={15} /> Delete
            </button>
          </>
        )}

        <button
          onClick={onClose}
          className="rounded-xl p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer transition-all ml-1"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
