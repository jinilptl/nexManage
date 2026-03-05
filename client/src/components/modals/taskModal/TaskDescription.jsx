import { AlignLeft } from "lucide-react";

export default function TaskDescription({ description }) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2.5">
        <div className="p-1.5 bg-indigo-50 text-indigo-500 rounded-lg">
          <AlignLeft size={14} />
        </div>
        Description
      </h3>
      <div className="rounded-xl bg-gray-50/70 px-5 py-4 text-sm text-gray-600 leading-relaxed border border-gray-100 whitespace-pre-wrap">
        {description || (
          <span className="italic text-gray-400">No description provided.</span>
        )}
      </div>
    </section>
  );
}
