import { CheckCircle2, Clock, AlertTriangle, TrendingUp, RefreshCw } from "lucide-react";
import useAnalyticsData from "../../hooks/useAnalyticsData";
import PageHeader from "../../components/Analytics/PageHeader";
import MetricCard from "../../components/Analytics/MetricCard";
import StatusPieChart from "../../components/Analytics/StatusPieChart";
import VelocityLineChart from "../../components/Analytics/VelocityLineChart";
import PriorityBarChart from "../../components/Analytics/PriorityBarChart";

import ProjectProgress from "../../components/Analytics/ProjectProgress";
import { useSelector } from "react-redux";
import { use, useEffect } from "react";
import NexManageLoader from "../../components/Lodders/NexManageLoader";

export default function AnalyticsPage() {
  const role = useSelector((state) => state.auth.user?.role);

  useEffect(() => {
    document.title = "Analytics | NexManage";
  }, []);

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

    activeProjects,
  } = useAnalyticsData();

  if (loading) {
    return (
      <div className=" flex justify-center items-center h-[70vh]">
        <NexManageLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
          <AlertTriangle size={24} className="text-red-500" />
        </div>
        <div className="text-center max-w-xs">
          <h3 className="text-base font-bold text-gray-800 mb-1">Failed to load analytics</h3>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <RefreshCw size={14} />
          Try Again
        </button>
      </div>
    );
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
              <span className="text-base text-gray-600">
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

      <div className="grid grid-cols-1 gap-6">
        <PriorityBarChart priorityData={priorityData} />
      </div>

      <ProjectProgress projects={activeProjects} />
    </div>
  );
}
