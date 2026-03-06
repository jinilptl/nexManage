import { useState, useEffect } from "react";
import {
  MoreVertical,
  Users,
  Calendar,
  Eye,
  Archive,
  RotateCcw,
  ArrowRight,
  FolderKanban,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ButtonLoader from "../Lodders/ButtonLoader";
import { useNavigate } from "react-router-dom";
import {
  setSelectedProjectData,
  setSelectedProjectId,
} from "../../Redux_Config/Slices/projectsSlice";
import Avatar from "../common/Avatar";

const GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-sky-600",
];
const getGradient = (name = "") =>
  GRADIENTS[name.charCodeAt(0) % GRADIENTS.length];

const STATUS_MAP = {
  ACTIVE: { label: "Active", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  ON_HOLD: { label: "On Hold", cls: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-400" },
  COMPLETED: { label: "Completed", cls: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  ARCHIVED: { label: "Archived", cls: "bg-gray-100 text-gray-500 border-gray-200", dot: "bg-gray-400" },
};
const getStatus = (s) => STATUS_MAP[(s || "ACTIVE").toUpperCase()] ?? STATUS_MAP.ACTIVE;

function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-1.5 bg-slate-200 w-full" />
      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
          </div>
        </div>
        <div className="h-3 bg-slate-200 rounded w-full mb-2" />
        <div className="h-3 bg-slate-200 rounded w-5/6 mb-6" />
        <div className="flex justify-between">
          <div className="h-6 w-20 bg-slate-200 rounded-full" />
          <div className="h-6 w-16 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function ProjectCard({ project, onView, onArchive, onDelete, loading }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const UserRole = user.role;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handler = () => setMenuOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  if (loading) return <ProjectCardSkeleton />;

  function openProjectDetails(e) {
    e.stopPropagation();
    dispatch(setSelectedProjectId(project._id));
    dispatch(setSelectedProjectData(project));
    navigate(`/dashboard/projects/task/${project._id}`);
  }

  const membersCount = project.projectMembers?.length || 0;
  const visibleMembers = (project.projectMembers || []).slice(0, 4);
  const extraMembers = Math.max(0, membersCount - 4);
  const status = getStatus(project.status);
  const gradient = getGradient(project.projectName);
  const initial = (project.projectName || "P")[0].toUpperCase();
  const isArchived = (project.status || "").toUpperCase() === "ARCHIVED";

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden relative"
      onClick={openProjectDetails}
    >
      <div className={`h-1.5 w-full bg-linear-to-r ${gradient} shrink-0`} />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300`}>
            <span className="text-lg font-black text-white">{initial}</span>
          </div>

          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-1 w-48 bg-white rounded-xl z-50 border border-gray-200 overflow-hidden py-1"
                style={{ boxShadow: "0 8px 30px -4px rgba(0,0,0,0.12), 0 4px 12px -2px rgba(0,0,0,0.07)" }}
              >
                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                  onClick={() => { onView(project); setMenuOpen(false); }}
                >
                  <Eye className="w-4 h-4" /> View Details
                </button>
                {UserRole !== "member" && (
                  <button
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${isArchived
                        ? "text-emerald-600 hover:bg-emerald-50"
                        : "text-amber-600 hover:bg-amber-50"
                      }`}
                    onClick={() => {
                      onArchive?.({ ...project, status: isArchived ? "ACTIVE" : "ARCHIVED" });
                      setMenuOpen(false);
                    }}
                  >
                    {isArchived ? <RotateCcw className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                    {isArchived ? "Activate" : "Archive"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <h2 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
          {project.projectName}
        </h2>

        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 flex-1 mb-4">
          {project.description || "No description provided"}
        </p>

        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span>{new Date(project.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
          <span className="mx-1 text-gray-200">•</span>
          <FolderKanban className="w-3.5 h-3.5 shrink-0" />
          <span className="capitalize">{project.projectType || "team"}</span>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {membersCount > 0 ? (
                <div className="flex -space-x-2">
                  {visibleMembers.map((m, i) => (
                    <Avatar
                      key={i}
                      user={m.user}
                      className="w-6 h-6 text-[9px] ring-2 ring-white shadow-sm"
                    />
                  ))}
                  {extraMembers > 0 && (
                    <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white ring-1 ring-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-500">
                      +{extraMembers}
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-xs text-gray-400 italic">No members</span>
              )}
              {membersCount > 0 && (
                <span className="text-xs text-gray-400 font-medium">{membersCount} member{membersCount !== 1 ? "s" : ""}</span>
              )}
            </div>

            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${status.cls}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>

          <button
            onClick={openProjectDetails}
            className={`mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer bg-linear-to-r ${gradient} text-white opacity-0 group-hover:opacity-100 shadow-md hover:shadow-lg active:scale-95`}
          >
            Open Project <ArrowRight size={13} />
          </button>
        </div>
      </div>

      <div className="px-5 py-2.5 border-t border-gray-50 bg-gray-50/60 flex items-center gap-2">
        <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide">By</span>
        <Avatar user={project.createdBy} className="w-4 h-4 text-[8px] shadow-sm" />
        <span className="text-xs font-semibold text-gray-600 truncate">
          {project.createdBy?.name || "Unknown"}
        </span>
      </div>
    </div>
  );
}
