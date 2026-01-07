import { CheckCircle } from "lucide-react";

export default function TaskActivity({ activities }) {
  return (
    <section>
      <h4 className="mb-2 text-xs font-semibold uppercase text-gray-500">
        Activity
      </h4>
      <div className="space-y-3 text-sm text-gray-600">
        {(activities || ["Task created", "Assignees updated"]).map((a, i) => (
          <div key={i} className="flex gap-2">
            <CheckCircle size={16} className="text-green-500" />
            <span>{a}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
