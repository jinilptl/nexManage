export default function TaskDescription({ description }) {
  return (
    <section className="mb-0">
      <h3 className="mb-3 text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
        <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />
        Description
      </h3>
      <div className="rounded-2xl bg-gray-50/50 p-6 text-sm text-gray-600 leading-relaxed border border-gray-100 italic">
        {description || "No description provided."}
      </div>
    </section>
  );
}
