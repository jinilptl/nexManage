import { X, Pencil, Trash2 } from "lucide-react";

export default function TaskHeader({ task, onEdit, onDelete, onClose }) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {task.title}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Task ID : Task-{task._id.slice(0,7)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="rounded-lg bg-gray-200 cursor-pointer px-3 py-1.5 text-sm hover:bg-gray-300 flex items-center gap-1"
        >
          <Pencil size={14} /> Edit
        </button>

        <button
          onClick={onDelete}
          className="rounded-lg border border-red-200 cursor-pointer bg-red-50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100 flex items-center gap-1"
        >
          <Trash2 size={14} /> Delete
        </button>

        <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100 cursor-pointer">
          <X />
        </button>
      </div>
    </div>
  );
}
