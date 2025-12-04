import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import ProjectCard from "../../components/projects/ProjectCard";
import ProjectFilters from "../../components/projects/ProjectFilters";
import { dummyProjects, dummyTeams } from "../../assets/dummyData/dummyData";
import ProjectModal from "../../components/projects/ProjectModal";
import { useDispatch, useSelector } from "react-redux";
import ViewProjectModal from "../../components/projects/ViewProjectModal";
import { fetchAllProjectsService } from "../../services/projectsOperations/projectsServices";

export default function ProjectsPage() {
 
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const { list } = useSelector((state) => state.teams);
  const { token, user } = useSelector((state) => state.auth);
  const {  allProjects } = useSelector((state) => state.projects);
   const projects = allProjects;
  const dispatch = useDispatch();

  console.log("all project is---> ",allProjects);
  

  useEffect(() => {
    if (token && user) {
      dispatch(fetchAllProjectsService(token, user?.role));
    }
  }, [token, user]);

  useEffect(()=>{
dispatch(fetchAllProjectsService(token, user?.role));
    
  },[])

  return (
    <div className="pt-16 px-4 md:px-6 pb-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 text-2xl font-bold">Projects</h1>
          <p className="text-gray-600">Manage and track all your projects</p>
        </div>

        <button
          onClick={() => {
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> Create Project
        </button>
      </div>

      {/* Filters */}
      <ProjectFilters />

      {/* Project Cards */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              loading={false}
              onView={(project) => {
                setSelectedProject(project);
                setViewModal(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <p className="text-gray-600">No projects found.</p>
        </div>
      )}

      <ProjectModal
        open={showModal}
        onClose={() => setShowModal(false)}
        mode="create"
        teamsList={list}
      />

      <ViewProjectModal
        open={viewModal}
        onClose={() => setViewModal(false)}
        project={selectedProject}
      />
    </div>
  );
}
