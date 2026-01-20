import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import SectionCard from "./SectionCard";

export default function PriorityBarChart({ priorityData }) {
  return (
    <SectionCard
      title="Priority Breakdown"
      subtitle="Tasks grouped by priority level"
    >
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={priorityData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3B82F6" name="Tasks" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
