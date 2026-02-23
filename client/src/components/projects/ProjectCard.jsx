import { useState, useEffect } from "react";
import { MoreVertical, Users, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ButtonLoader from "../Lodders/ButtonLoader";
import { useNavigate } from "react-router-dom";
import { fetchSingleProjectService } from "../../services/projectsOperations/projectsServices";
import {
  setSelectedProjectData,
  setSelectedProjectId,
} from "../../Redux_Config/Slices/projectsSlice";
import Avatar from "../common/Avatar";

export default function ProjectCard({
  project,
  onView,
  onArchive,
  onDelete,
  loading,
}) {
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

  function ProjectDetails() {
    dispatch(setSelectedProjectId(project._id));
    dispatch(setSelectedProjectData(project));
    navigate(`/dashboard/projects/task/${project._id}`);
  }

  const membersCount = project.projectMembers?.length || 0;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div className="w-12 h-12 rounded-xl bg-slate-200" />
        <div className="mt-4 h-6 w-3/4 bg-slate-200 rounded" />
        <div className="mt-4 h-3 w-full bg-slate-200 rounded" />
        <div className="mt-2 h-3 w-5/6 bg-slate-200 rounded" />

        <div className="mt-8 flex items-center gap-2">
          <div className="h-4 w-4 bg-slate-200 rounded" />
          <div className="h-4 w-24 bg-slate-200 rounded" />
        </div>

        <div className="mt-6 pt-5 border-t border-gray-100 flex justify-between">
          <div className="h-6 w-20 bg-slate-200 rounded-lg" />
          <div className="h-6 w-16 bg-slate-200 rounded-full" />
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="h-3 w-16 bg-slate-200 rounded" />
          <div className="flex gap-2 items-center">
            <div className="h-6 w-6 bg-slate-200 rounded-full" />
            <div className="h-3 w-20 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative cursor-pointer group flex flex-col h-full"
      onClick={() => {
        ProjectDetails();
      }}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center border border-blue-100/50 group-hover:scale-110 transition-transform duration-300 shadow-sm">
            <Users className="w-6 h-6 text-blue-600" />
          </div>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-400 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
            >
              <MoreVertical className="w-5 h-5 cursor-pointer" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-xl z-50 animate-fadeIn border border-gray-100 overflow-hidden">
                <button
                  className="w-full flex items-center cursor-pointer justify-between px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => {
                    onView(project);
                    setMenuOpen(false);
                  }}
                >
                  <span>View Project</span>
                </button>

                {UserRole !== "member" && <div className="border-t"></div>}

                {UserRole !== "member" && (
                  <button
                    className={`w-full flex items-center cursor-pointer justify-between px-4 py-2 text-sm ${(project.status || "").toUpperCase() === "ARCHIVED"
                      ? "text-green-600"
                      : "text-yellow-600"
                      } hover:bg-gray-100`}
                    onClick={() => {
                      const newStatus =
                        (project.status || "").toUpperCase() === "ARCHIVED"
                          ? "ACTIVE"
                          : "ARCHIVED";
                      onArchive?.({ ...project, status: newStatus });
                      setMenuOpen(false);
                    }}
                  >
                    <span>
                      {(project.status || "").toUpperCase() === "ARCHIVED"
                        ? "Activate Project"
                        : "Archive Project"}
                    </span>
                    {loading && <ButtonLoader />}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mt-5 group-hover:text-blue-600 transition-colors duration-200 line-clamp-1">{project.projectName}</h2>

        <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed grow">
          {project.description || "No description provided"}
        </p>

        <div className="mt-6 space-y-5">
          <div className="flex items-center text-gray-500 gap-2 text-sm font-medium">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>
              {new Date(project.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-gray-100">
            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
              <span className="text-xs font-bold text-gray-700">
                {membersCount}
              </span>
              <span className="text-xs font-medium text-gray-500">Members</span>
            </div>

            <span
              className={`px-3 py-1 text-xs font-bold rounded-full border ${(project.status || "").toUpperCase() === "ACTIVE"
                ? "bg-green-50 text-green-700 border-green-200"
                : (project.status || "").toUpperCase() === "ON_HOLD"
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : (project.status || "").toUpperCase() === "COMPLETED"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : (project.status || "").toUpperCase() === "ARCHIVED"
                      ? "bg-gray-50 text-gray-600 border-gray-200"
                      : "bg-gray-50 text-gray-600 border-gray-200"
                }`}
            >
              {{
                ACTIVE: "Active",
                COMPLETED: "Completed",
                ON_HOLD: "On Hold",
                ARCHIVED: "Archived",
              }[(project.status || "ACTIVE").toUpperCase()] ||
                project.status ||
                "Active"}
            </span>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Created By</span>
            <div className="flex items-center gap-2">
              <Avatar user={project.createdBy} className="w-6 h-6 text-[10px] shadow-sm border md:border-white" />
              <span className="text-xs font-bold text-gray-700">
                {project.createdBy?.name
                  ? project.createdBy.name[0].toUpperCase() +
                  project.createdBy.name.slice(1)
                  : "Unknown"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
