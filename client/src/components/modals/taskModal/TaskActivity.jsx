import { CheckCircle } from "lucide-react";

export default function TaskActivity({ activities }) {
  console.log("activites in task activits --> ",activities);
  
  return (
    <section>
      <h4 className="mb-2 text-xs font-semibold uppercase text-gray-500">
        Activity
      </h4>
      <div className="space-y-3 text-sm text-gray-600">
        {activities?.map((a, i) => (
          <div key={i} className="flex gap-2">
            <CheckCircle size={16} className="text-green-500" />
            <span>{a.action} By  {a.performedBy.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
