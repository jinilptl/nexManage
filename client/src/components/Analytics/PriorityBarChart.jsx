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
  Cell,
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
            <Bar dataKey="count" name="Tasks">
              {priorityData?.map((entry, index) => {
                const name = (entry.name || "").toLowerCase();
                let color = "#3B82F6"; 
                if (name.includes("critical")) color = "#D32F2F";
                else if (name.includes("high")) color = "#F57C00";
                else if (name.includes("medium")) color = "#FBC02D";
                else if (name.includes("low")) color = "#388E3C";

                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
