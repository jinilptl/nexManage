import { useEffect, useState } from "react";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  User,
  MessageSquare,
  FileText,
  Users,
} from "lucide-react";
import DashboardHearderCard from "./DashboardHearderCard";
import ProjectProgress from "./Analytics/ProjectProgress";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardData } from "../Redux_Config/Slices/dashboardSlice";

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token)
  const isAdmin = user?.role === "super_admin" || user?.role === "admin";
  const UserRole = user.role;
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.dashboard);
  const projects = data?.projectProgress || [];
  const upcomingDeadlines = data?.upcomingDeadlines || [];
  const recentActivity = data?.recentActivity || [];
  const [showAllDeadlines, setShowAllDeadlines] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(getDashboardData(token));
    }
  }, [dispatch, token]);

  const tasks = [
    { label: "To Do", color: "bg-slate-500", count: data?.todoCount || 0 },
    {
      label: "In Progress",
      color: "bg-blue-500",
      count: data?.inProgressCount || 0,
    },
    {
      label: "Review",
      color: "bg-orange-500",
      count: data?.pendingReviews || 0,
    },
    {
      label: "Done",
      color: "bg-green-500",
      count: data?.completedThisWeek || 0,
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (!data) return null;

  const visibleDeadlines = showAllDeadlines
    ? upcomingDeadlines
    : upcomingDeadlines.slice(0, 3);

  const visibleProjects = showAllProjects ? projects : projects.slice(0, 4);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Welcome back, {user.name[0].toUpperCase() + user.name.slice(1)}
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your projects today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardHearderCard
          heading="Total Projects"
          mainIcon={<FolderKanban className="h-4 w-4 text-blue-600" />}
          data={data?.totalProjects || 0}
          text={`${data?.activeProjectsCount || 0} Active, ${data?.completedProjectsCount || 0} Done`}
          textColor="text-blue-600"
        />
        <DashboardHearderCard
          heading="Total Teams"
          mainIcon={<Users className="h-4 w-4 text-purple-600" />}
          data={data?.totalTeams || 0}
          text="Active collaborations"
          textColor="text-purple-600"
        />
        <DashboardHearderCard
          heading={isAdmin ? "Total Tasks" : "My Tasks"}
          mainIcon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
          data={data?.totalTasksCount || 0}
          text={`${data?.completedThisWeek || 0} completed this week`}
          textColor="text-green-600"
        />
        <DashboardHearderCard
          heading="Action Required"
          mainIcon={<AlertCircle className="h-4 w-4 text-orange-600" />}
          data={
            (data?.pendingReviews || 0) + (data?.upcomingDeadlines?.length || 0)
          }
          text={`${data?.pendingReviews || 0} reviews pending`}
          textColor="text-orange-600"
        />
      </div>

      {/* Project Status Breakdown */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Project Status Breakdown
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">
              Active
            </p>
            <p className="text-2xl font-bold text-blue-600">
              {data?.activeProjectsCount || 0}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">
              Completed
            </p>
            <p className="text-2xl font-bold text-green-600">
              {data?.completedProjectsCount || 0}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">
              On Hold
            </p>
            <p className="text-2xl font-bold text-yellow-600">
              {data?.onHoldProjectsCount || 0}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">
              Archived
            </p>
            <p className="text-2xl font-bold text-gray-400">
              {data?.archivedProjectsCount || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm  ">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {isAdmin ? "All Tasks Overview" : "My Tasks Overview"}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Quick overview of your assigned tasks
          </p>

          <div className="space-y-3">
            {tasks.map((task, idx) => (
              <div key={idx * Math.random()}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${task.color}`}></div>
                    <span className="text-sm text-gray-700">{task.label}</span>
                  </div>
                  <span className="text-sm text-gray-500">{task.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Recent Activity
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Latest updates across your projects
          </p>

          {/* SCROLL CONTAINER */}
          <div className="space-y-4 max-h-[246px] overflow-y-auto pr-2">
            {data?.recentActivity?.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                  {a.updatedBy?.name?.[0]?.toUpperCase()}
                </div>

                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{a.updatedBy?.name}</span>{" "}
                    <span className="text-gray-600">
                      {new Date(a.createdAt).getTime() ===
                        new Date(a.updatedAt).getTime()
                        ? "created task"
                        : "updated task"}
                    </span>{" "}
                    <span className="text-gray-800">{a.title}</span>
                  </p>

                  <p className="text-xs text-gray-600">
                    {new Date(a.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* -------------------- DEADLINES + PROGRESS -------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* -------- Upcoming Deadlines -------- */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Upcoming Deadlines
          </h2>
          <p className="text-sm text-gray-600 mb-4">Tasks due within 7 days</p>

          {visibleDeadlines.length === 0 && (
            <p className="text-sm text-gray-500">No upcoming deadlines</p>
          )}

          {visibleDeadlines.map((d, i) => {
            const dueIn = Math.ceil(
              (new Date(d.dueDate) - new Date()) / (1000 * 60 * 60 * 24),
            );

            const isHigh = dueIn <= 1;

            return (
              <div
                key={i}
                className={`p-3 rounded-lg mb-2 ${isHigh ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm">{d.title}</span>
                    <p className="text-xs opacity-75">
                      Due in {dueIn} day{dueIn !== 1 && "s"}
                    </p>
                  </div>
                  {isHigh && <AlertCircle className="w-4 h-4 text-red-500" />}
                </div>
              </div>
            );
          })}

          {upcomingDeadlines.length > 3 && (
            <button
              onClick={() => setShowAllDeadlines(!showAllDeadlines)}
              className="text-sm text-blue-600 hover:underline mt-2"
            >
              {showAllDeadlines ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* -------- Project Progress -------- */}
        <ProjectProgress
          projects={visibleProjects}
          gridClassName="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-2"
          footer={
            projects.length > 4 && (
              <button
                onClick={() => setShowAllProjects(!showAllProjects)}
                className="text-sm text-blue-600 hover:underline mt-4"
              >
                {showAllProjects ? "Show less" : "Show more"}
              </button>
            )
          }
        />
      </div>
    </div>
  );
}
