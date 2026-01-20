import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import SectionCard from "./SectionCard";

export default function VelocityLineChart({ velocityData }) {
  return (
    <SectionCard
      title="Team Velocity"
      subtitle="Tasks completed over the last 12 weeks"
    >
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={velocityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#3B82F6"
              strokeWidth={2}
              name="Tasks Completed"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
