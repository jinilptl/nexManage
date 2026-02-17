import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import SectionCard from "./SectionCard";

export default function StatusPieChart({ statusData }) {
  const STATUS_COLORS = {
    "To Do": "#e41a1c",
    "In Progress": "#377eb8",
    Review: "#ff7f00",
    Done: "#4daf4a",
  };

  return (
    <SectionCard
      title="Task Status Distribution"
      subtitle="Breakdown of tasks by status"
    >
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              dataKey="value"
            >
              {statusData.map((entry, index) => {
                const fillColor = STATUS_COLORS[entry.name] || entry.color;

                return <Cell key={index} fill={fillColor} />;
              })}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
