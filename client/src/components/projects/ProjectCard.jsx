import { useState, useEffect } from "react";
import { MoreVertical, Users, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ButtonLoader from "../Lodders/ButtonLoader";
import { useNavigate } from "react-router-dom";
import { fetchSingleProjectService } from "../../services/projectsOperations/projectsServices";
import { setSelectedProjectData, setSelectedProjectId } from "../../Redux_Config/Slices/projectsSlice";

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
  const navigate=useNavigate()
  const dispatch=useDispatch()

  useEffect(() => {
    const handler = () => setMenuOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  function ProjectDetails(){
    dispatch(setSelectedProjectId(project._id))
    dispatch(setSelectedProjectData(project))
    navigate(`/dashboard/projects/task/${project._id}`)
    
  }

  const membersCount = project.projectMembers?.length || 0;

 
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="w-12 h-12 rounded-lg bg-slate-200" />
        <div className="mt-4 h-4 w-32 bg-slate-200 rounded" />
        <div className="mt-2 h-3 w-52 bg-slate-200 rounded" />
        <div className="mt-2 h-3 w-40 bg-slate-200 rounded" />

        <div className="mt-6 h-4 w-28 bg-slate-200 rounded" />
        <div className="mt-2 h-4 w-full bg-slate-200 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition relative cursor-pointer" onClick={()=>{
      ProjectDetails()
    }}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="p-1 rounded-md hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg z-50 animate-fadeIn border border-gray-100 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 text-sm"
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
                    className="w-full flex items-center justify-between px-4 py-2 text-yellow-600 hover:bg-gray-100 text-sm"
                    onClick={() => {
                      onArchive?.(project);
                      setMenuOpen(false);
                    }}
                  >
                    <span>Archive Project</span>
                    {loading && <ButtonLoader />}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <h2 className="text-lg font-semibold mt-3">{project.projectName}</h2>

        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {project.description || "No description provided"}
        </p>

        <div className="mt-6 space-y-4">
          <div className="flex items-center text-gray-600 gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(project.createdAt).toLocaleDateString("en-IN")}
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <span className="text-sm text-gray-700">
              {membersCount} Members
            </span>

            <span
              className={`px-2 py-1 text-xs rounded-md capitalize ${
                project.status === "active"
                  ? "bg-green-100 text-green-700"
                  : project.status === "onhold"
                  ? "bg-yellow-100 text-yellow-700"
                  : project.status === "completed"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {project.status}
            </span>
          </div>

          <div className="p-1 flex justify-center">
            <span className="text-xs text-gray-500 flex gap-1">
              Created By :
              <span className="font-semibold whitespace-nowrap">
                {project.createdBy?.name
                  ? project.createdBy.name[0].toUpperCase() +
                    project.createdBy.name.slice(1)
                  : "Unknown"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
