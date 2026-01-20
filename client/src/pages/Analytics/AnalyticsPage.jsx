import React from "react";
import { CheckCircle2, Clock, AlertTriangle, TrendingUp } from "lucide-react";

import useAnalyticsData from "../../hooks/useAnalyticsData";

import PageHeader from "../../components/Analytics/PageHeader";
import MetricCard from "../../components/Analytics/MetricCard";
import StatusPieChart from "../../components/Analytics/StatusPieChart";
import VelocityLineChart from "../../components/Analytics/VelocityLineChart";
import PriorityBarChart from "../../components/Analytics/PriorityBarChart";
import TopContributors from "../../components/Analytics/TopContributors";
import ProjectProgress from "../../components/Analytics/ProjectProgress";

export default function AnalyticsPage() {
  const {
    totalTasks,
    completedTasks,
    inProgressTasks,
    overdueTasks,
    completionRate,
    statusData,
    priorityData,
    velocityData,
    contributors,
    activeProjects,
  } = useAnalyticsData();

  return (
    <div className="space-y-6 mt-5 ml-2">
      <PageHeader
        title="Analytics"
        subtitle="Track your team's performance and project metrics"
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Tasks"
          value={totalTasks}
          icon={<CheckCircle2 className="h-4 w-4 text-blue-600" />}
          footer={
            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+12% from last month</span>
            </div>
          }
        />

        <MetricCard
          title="Completed"
          value={
            <>
              {completedTasks}{" "}
              <span className="text-base text-gray-500">({completionRate}%)</span>
            </>
          }
          icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
          footer={
            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+8% from last month</span>
            </div>
          }
        />

        <MetricCard
          title="In Progress"
          value={inProgressTasks}
          icon={<Clock className="h-4 w-4 text-blue-600" />}
          footer={<p className="text-xs text-blue-600 mt-1">Active development</p>}
        />

        <MetricCard
          title="Overdue"
          value={overdueTasks}
          icon={<AlertTriangle className="h-4 w-4 text-red-600" />}
          footer={<p className="text-xs text-red-600 mt-1">Needs attention</p>}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusPieChart statusData={statusData} />
        <VelocityLineChart velocityData={velocityData} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriorityBarChart priorityData={priorityData} />
        <TopContributors contributors={contributors} />
      </div>

      {/* Project Progress */}
      <ProjectProgress projects={activeProjects} />
    </div>
  );
}
