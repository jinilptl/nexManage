import React, { useEffect, useState } from "react";
import ProjectHeader from "../../components/ProjectDetails/ProjectHeader";
import ProjectTabs from "../../components/ProjectDetails/ProjectTabs";
import ProjectContent from "../../components/ProjectDetails/ProjectContent";
import { useDispatch, useSelector } from "react-redux";
import CreateTaskModal from "../../components/modals/taskModal/CreateTaskModal";
import CreateTeamModal from "../../components/modals/teamsModals/CreateTeamModal";
import {
  createTaskService,
  getAllTasksService,
} from "../../services/taskOperations/taskServices";


export default function ProjectDetails() {
  const [activeTab, setActiveTab] = useState("board");
  const [tasks, setTasks] = useState([]);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const projectData = useSelector((state) => state.projects.selectedProject);
  const taskList = useSelector((state) => state.tasks.list);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  // console.log("task list ---> ",taskList);
  

  // console.log("project |Data===> ", projectData);
  const reorderTaskInColumn = (columnId, fromIndex, toIndex) => {
    setTasks((prev) => {
      const columnTasks = prev.filter((t) => t.status === columnId);
      const otherTasks = prev.filter((t) => t.status !== columnId);

      const [moved] = columnTasks.splice(fromIndex, 1);
      columnTasks.splice(toIndex, 0, moved);

      return [...otherTasks, ...columnTasks];
    });
  };

 useEffect(() => {
  if (projectData?.id && token) {
    dispatch(getAllTasksService(projectData.id, token));
  }
}, [dispatch, projectData?.id, token]);


  useEffect(() => {
  setTasks(taskList || []);
}, [taskList]);


  // console.log(
  //   "main task in deialts --> ",tasks
  // );
  
  const onSubmit = (formData) => {
    // console.log("form Data is ---> ", formData);

    dispatch(
      createTaskService(formData, projectData.id, token, setCreateTaskModalOpen)
    );
  };
  return (
    <div className="px-8 py-6 bg-gray-50 min-h-screen overflow-x-hidden min-w-0">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        Projects <span className="mx-1">›</span>
        <span className="text-gray-700">{projectData.data.projectName}</span>
      </div>

      <ProjectHeader project={projectData.data} />

      <ProjectTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <ProjectContent
        activeTab={activeTab}
        tasks={tasks}
        setTasks={setTasks}
        reorderTaskInColumn={reorderTaskInColumn}
        onModalOpen={setCreateTaskModalOpen}
        modalOpen={createTaskModalOpen}
      />

      {createTaskModalOpen && (
        <CreateTaskModal
          isOpen={createTaskModalOpen}
          onClose={setCreateTaskModalOpen}
          projectMembers={projectData.data.projectMembers}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}
