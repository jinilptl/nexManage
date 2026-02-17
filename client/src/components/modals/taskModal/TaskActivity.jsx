import { CheckCircle } from "lucide-react";

export default function TaskActivity({ activities }) {
  return (
    <section className="mt-8">
      <h4 className="mb-4 text-xs font-bold uppercase text-gray-400 tracking-widest px-1">
        Recent Activity
      </h4>
      <div className="space-y-4">
        {activities?.length > 0 ? (
          activities.map((a, i) => (
            <div key={i} className="flex gap-3 group">
              <div className="mt-0.5 relative">
                <div className="h-5 w-5 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 ring-2 ring-white">
                  <CheckCircle size={10} className="text-indigo-500" />
                </div>
                {i < activities.length - 1 && (
                  <div className="absolute top-5 left-2.5 w-0.5 h-full -mb-4 bg-gray-100 group-hover:bg-indigo-100 transition-colors" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-700 leading-none">
                  {a.action}
                </span>
                <span className="text-[10px] text-gray-400 font-medium mt-1">
                  By {a.performedBy?.name || "Unknown"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400 italic px-1">No activity yet</p>
        )}
      </div>
    </section>
  );
}
