import { CheckCircle2, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import useAnalyticsData from "../../hooks/useAnalyticsData";
import PageHeader from "../../components/Analytics/PageHeader";
import MetricCard from "../../components/Analytics/MetricCard";
import StatusPieChart from "../../components/Analytics/StatusPieChart";
import VelocityLineChart from "../../components/Analytics/VelocityLineChart";
import PriorityBarChart from "../../components/Analytics/PriorityBarChart";
import TopContributors from "../../components/Analytics/TopContributors";
import ProjectProgress from "../../components/Analytics/ProjectProgress";
import { useSelector } from "react-redux";
import { use, useEffect } from "react";

export default function AnalyticsPage() {
  const role = useSelector((state) => state.auth.user?.role);

  useEffect(() => {
    if (role) {
      document.title = role === "member" ? "My Analytics" : "Analytics";
    }
  }, [role]);

  console.log(role);
  const {
    loading,
    error,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="space-y-6 mt-5 ml-2">
      <PageHeader
        title={role === "member" ? "My Analytics" : "Analytics"}
        subtitle={
          role === "member"
            ? "Your personal task performance"
            : "Track your team's performance"
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Tasks"
          value={totalTasks}
          icon={<CheckCircle2 className="h-4 w-4 text-blue-600" />}
          footer={
            <p className="text-xs text-blue-600 mt-1">All created tasks</p>
          }
        />

        <MetricCard
          title="Completed"
          value={
            <>
              {completedTasks}{" "}
              <span className="text-base text-gray-500">
                ({completionRate}%)
              </span>
            </>
          }
          icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
          footer={
            <p className="text-xs text-green-600 mt-1">Successfully finished</p>
          }
        />

        <MetricCard
          title="In Progress"
          value={inProgressTasks}
          icon={<Clock className="h-4 w-4 text-blue-600" />}
          footer={
            <p className="text-xs text-blue-600 mt-1">Active development</p>
          }
        />

        <MetricCard
          title="Overdue"
          value={overdueTasks}
          icon={<AlertTriangle className="h-4 w-4 text-red-600" />}
          footer={<p className="text-xs text-red-600 mt-1">Needs attention</p>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusPieChart statusData={statusData} />
        <VelocityLineChart velocityData={velocityData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriorityBarChart priorityData={priorityData} />
        <TopContributors contributors={contributors} />
      </div>

      <ProjectProgress projects={activeProjects} />
    </div>
  );
}
