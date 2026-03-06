import { useEffect, useState } from "react";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  Flame,
  CalendarClock,
} from "lucide-react";
import { formatRelativeTime } from "../utils/formatRelativeTime";
import DashboardHearderCard from "./DashboardHearderCard";
import ProjectProgress from "./Analytics/ProjectProgress";
import Avatar from "./common/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardData } from "../Redux_Config/Slices/dashboardSlice";
import NexManageLoader from "./Lodders/NexManageLoader";

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
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
    { label: "To Do", bar: "bg-slate-400", count: data?.todoCount || 0 },
    { label: "In Progress", bar: "bg-blue-500", count: data?.inProgressCount || 0 },
    { label: "Review", bar: "bg-orange-500", count: data?.pendingReviews || 0 },
    { label: "Done", bar: "bg-emerald-500", count: data?.completedThisWeek || 0 },
  ];
  const totalTasks = tasks.reduce((s, t) => s + t.count, 0);

  if (loading) {
    return (
      <div className=" flex justify-center items-center h-[70vh]">
        <NexManageLoader />
      </div>
    );
  }
  if (!data) return null;

  const visibleDeadlines = showAllDeadlines
    ? upcomingDeadlines
    : upcomingDeadlines.slice(0, 3);

  const visibleProjects = showAllProjects ? projects : projects.slice(0, 4);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Welcome back, {user.name[0].toUpperCase() + user.name.slice(1)}
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your projects today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardHearderCard
          heading="Total Projects"
          mainIcon={<FolderKanban className="h-6 w-6 text-white" />}
          data={data?.totalProjects || 0}
          text={`${data?.activeProjectsCount || 0} Active, ${data?.completedProjectsCount || 0} Done`}
          bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <DashboardHearderCard
          heading="Total Teams"
          mainIcon={<Users className="h-6 w-6 text-white" />}
          data={data?.totalTeams || 0}
          text="Active collaborations"
          bgColor="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <DashboardHearderCard
          heading={isAdmin ? "Total Tasks" : "My Tasks"}
          mainIcon={<CheckCircle2 className="h-6 w-6 text-white" />}
          data={data?.totalTasksCount || 0}
          text={`${data?.completedThisWeek || 0} completed this week`}
          bgColor="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <DashboardHearderCard
          heading="Action Required"
          mainIcon={<AlertCircle className="h-6 w-6 text-white" />}
          data={
            (data?.pendingReviews || 0) + (data?.upcomingDeadlines?.length || 0)
          }
          text={`${data?.pendingReviews || 0} reviews pending`}
          bgColor="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          Project Status Breakdown
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <p className="text-sm text-gray-600 font-medium">Active</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {data?.activeProjectsCount || 0}
            </p>
          </div>
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <p className="text-sm text-gray-600 font-medium">Completed</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {data?.completedProjectsCount || 0}
            </p>
          </div>
          <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <p className="text-sm text-gray-600 font-medium">On Hold</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {data?.onHoldProjectsCount || 0}
            </p>
          </div>
          <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <p className="text-sm text-gray-600 font-medium">Archived</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {data?.archivedProjectsCount || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-0.5">
            {isAdmin ? "All Tasks Overview" : "My Tasks Overview"}
          </h2>
          <p className="text-xs text-gray-500 mb-4">Quick snapshot of task status distribution</p>

          <div className="space-y-3.5">
            {tasks.map((task) => {
              const pct = totalTasks > 0 ? Math.round((task.count / totalTasks) * 100) : 0;
              return (
                <div key={task.label}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${task.bar}`} />
                      <span className="text-sm font-medium text-gray-700">{task.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{pct}%</span>
                      <span className="text-sm font-bold text-gray-800 w-5 text-right">{task.count}</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${task.bar} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-0.5">Recent Activity</h2>
          <p className="text-xs text-gray-500 mb-4">Latest updates across your projects</p>

          <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1 recent-activity-scroll">
            {data?.recentActivity?.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">No recent activity</p>
            )}
            {data?.recentActivity?.map((a, i) => {
              const isNew = new Date(a.createdAt).getTime() === new Date(a.updatedAt).getTime();
              return (
                <div key={i} className="flex gap-2.5 group">
                  <Avatar user={a.updatedBy} className="w-8 h-8 text-xs shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 leading-snug">
                      <span className="font-semibold">{a.updatedBy?.name}</span>
                      {" "}
                      <span className="text-gray-500">{isNew ? "created" : "updated"}</span>
                      {" "}
                      <span className="font-medium text-gray-800 truncate">"{a.title}"</span>
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{formatRelativeTime(a.updatedAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-0.5 flex items-center gap-2">
            <CalendarClock size={15} className="text-gray-400" />
            Upcoming Deadlines
          </h2>
          <p className="text-xs text-gray-500 mb-4">Tasks due within 7 days</p>

          {visibleDeadlines.length === 0 && (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 size={24} className="text-gray-200 mb-2" />
              <p className="text-sm text-gray-400">No upcoming deadlines</p>
            </div>
          )}

          <div className="space-y-2">
            {visibleDeadlines.map((d, i) => {
              const dueIn = Math.ceil((new Date(d.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
              const isOverdue = dueIn < 0;
              const isToday = dueIn === 0;
              const isUrgent = dueIn === 1;

              const config = isOverdue
                ? { cls: "bg-red-50 border-red-200", badge: "bg-red-500 text-white", label: "Overdue", icon: Flame }
                : isToday
                  ? { cls: "bg-orange-50 border-orange-200", badge: "bg-orange-500 text-white", label: "Due Today", icon: AlertCircle }
                  : isUrgent
                    ? { cls: "bg-amber-50 border-amber-200", badge: "bg-amber-100 text-amber-700", label: "Due Tomorrow", icon: Clock }
                    : { cls: "bg-gray-50 border-gray-100", badge: "bg-blue-100 text-blue-700", label: `${dueIn}d left`, icon: Clock };

              const BadgeIcon = config.icon;
              return (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${config.cls}`}>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{d.title}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {isOverdue ? `${Math.abs(dueIn)}d overdue` : isToday ? "Due today" : `Due in ${dueIn} day${dueIn !== 1 ? "s" : ""}`}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${config.badge}`}>
                    <BadgeIcon size={9} />
                    {config.label}
                  </span>
                </div>
              );
            })}
          </div>

          {upcomingDeadlines.length > 3 && (
            <button
              onClick={() => setShowAllDeadlines(!showAllDeadlines)}
              className="text-xs text-blue-600 hover:underline mt-3 font-medium"
            >
              {showAllDeadlines ? "Show less" : `Show all ${upcomingDeadlines.length}`}
            </button>
          )}
        </div>

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
