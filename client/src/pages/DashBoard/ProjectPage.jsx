import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import ProjectCard from "../../components/projects/ProjectCard";
import ProjectFilters from "../../components/projects/ProjectFilters";
import ProjectModal from "../../components/projects/ProjectModal";
import { useDispatch, useSelector } from "react-redux";
import ViewProjectModal from "../../components/projects/ViewProjectModal";
import {
  fetchAllProjectsService,
  fetchSingleProjectService,
} from "../../services/projectsOperations/projectsServices";
import {
  setSelectedProjectData,
  setSelectedProjectId,
  setSelectedProjectLoading,
} from "../../Redux_Config/Slices/projectsSlice";
import { fetchTeamsService } from "../../services/teamsOperations/teamsServices";
import NexManageLoader from "../../components/Lodders/NexManageLoader";

export default function ProjectsPage() {
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  // const [selectedProject, setSelectedProject] = useState(null);

  const { list } = useSelector((state) => state.teams);
  const { token, user } = useSelector((state) => state.auth);
  const { allProjects, myProjects } = useSelector((state) => state.projects);
  const { selectedProject } = useSelector((state) => state.projects);
  const projectsLoading = useSelector((state) => state.projects.loading);
  const loadingProject = useSelector(
  (state) => state.projects.selectedProject.loading
);
  const UserRole = user.role;
  const projects = UserRole !== "member" ? allProjects : myProjects;
  const dispatch = useDispatch();
  // console.log("all project is --> ",projects);
  const [searchInput, setSearchInput] = useState("");
  const [filterData, setfilterdata] = useState([]);

  const handleFilter = (value) => {
    setSearchInput(value);
  };
  
  useEffect(()=>{
    setfilterdata(projects)
  },[projects])

  useEffect(() => {
    if (!searchInput.trim()) {
      setfilterdata(projects);
      return;
    }

    const filtered = projects.filter((project) =>
      project.projectName
        .toLowerCase()
        .includes(searchInput.toLowerCase())
    );

    setfilterdata(filtered);
  }, [searchInput, projects]);

  useEffect(() => {
    if (token && user) {
      dispatch(fetchAllProjectsService(token, user?.role));
      dispatch(fetchTeamsService(token, user?.role));
    }
  }, [token, user]);

  const onViewhandler = (project) => {
    // setSelectedProject(project);

    dispatch(setSelectedProjectId(project._id));
     dispatch(setSelectedProjectLoading(true));
    dispatch(fetchSingleProjectService(project._id, token));
    setViewModal(true);
  };
  // console.log("selected projjetc ===> ",selectedProject);


  if(projectsLoading){
      return(
        <div className=" flex justify-center items-center h-[70vh]">
          <NexManageLoader/>
        </div>
      )
  }

  return (
    <div className="pt-5 px-4 md:px-2 pb-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 text-2xl font-bold">Projects</h1>
          <p className="text-gray-600">Manage and track all your projects</p>
        </div>

        {UserRole !== "member" && (
          <button
            onClick={() => {
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Create Project
          </button>
        )}
      </div>

      {/* Filters */}
      <ProjectFilters  searchInput={searchInput} OnFilter={handleFilter} />

      {/* Project Cards */}
      {filterData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterData.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              loading={false}
              onView={onViewhandler}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <p className="text-gray-600">No projects found.</p>
        </div>
      )}

      {showModal&&(<ProjectModal
        open={showModal}
        onClose={() => setShowModal(false)}
        mode="create"
        teamsList={list}
      />)}

      <ViewProjectModal
        open={viewModal}
        onClose={() => {
          setViewModal(false);
          dispatch(setSelectedProjectId(null));
          dispatch(setSelectedProjectData(null));
        }}
        project={selectedProject.data}
      />
    </div>
  );
}
