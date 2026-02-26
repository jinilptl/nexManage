import SectionCard from "./SectionCard";

export default function TopContributors({ contributors }) {
  return (
    <SectionCard
      title="Top Contributors"
      subtitle="Team members ranked by completed tasks"
    >
      <div className="space-y-4">
        {contributors.slice(0, 5).map((c, index) => (
          <div key={c.id} className="flex items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-sm text-gray-500 w-6">{index + 1}</span>

              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {c.avatar ? (
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold text-gray-700">
                    {c.name?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {c.name}
                </p>
                <p className="text-xs text-gray-500">
                  {c.tasksCompleted} tasks
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {c.avgCompletionTime} days
              </p>
              <p className="text-xs text-gray-500">avg. time</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
