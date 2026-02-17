import React, { useEffect, useRef, useState } from "react";
import ProjectHeader from "../../components/ProjectDetails/ProjectHeader";
import ProjectTabs from "../../components/ProjectDetails/ProjectTabs";
import ProjectContent from "../../components/ProjectDetails/ProjectContent";
import { useDispatch, useSelector } from "react-redux";
import CreateTaskModal from "../../components/modals/taskModal/CreateTaskModal";
import CreateTeamModal from "../../components/modals/teamsModals/CreateTeamModal";
import {
  createTaskService,
  deleteTaskService,
  getAllTasksService,
  getSingleTasksService,
  updateTaskService,
} from "../../services/taskOperations/taskServices";
import { Link, useParams } from "react-router-dom";
import { fetchSingleProjectService } from "../../services/projectsOperations/projectsServices";
import { connectWs } from "../../sockets/socket";
import {
  deleteTask,
  moveTaskRealtime,
  updateTask,
} from "../../Redux_Config/Slices/tasksSlice";

export default function ProjectDetails() {
  const [activeTab, setActiveTab] = useState("board");
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const projectData = useSelector((state) => state.projects.selectedProject);
  const taskList = useSelector((state) => state.tasks.list);
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

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
    if (!projectId || !user?._id) return;

    const socket = connectWs();
    socket.connect();

    // 1. Connection Event (Re-join room on reconnect)
    const onConnect = () => {
      console.log("🔌 Socket connected, joining project room:", projectId);
      socket.emit("join-project", { projectId });
    };

    // 2. Task Move Event
    const handleTaskMove = ({ taskId, toStatus, updatedBy }) => {
      if (updatedBy === user._id) return; // Ignore self-initiated events
      console.log("Socket: Task Moved", taskId, "to", toStatus);
      dispatch(moveTaskRealtime({ taskId, toStatus }));
    };

    // 3. Task Create Event
    const handleTaskCreate = ({ taskId, createdBy }) => {
      if (createdBy === user._id) return;
      console.log("Socket: Task Created", taskId);
      // Fetch the full task details to add to Redux
      dispatch(getSingleTasksService(projectId, taskId, token));
    };

    // 4. Task Update Event (General updates)
    const handleTaskUpdate = ({ taskId, updatedBy }) => {
      if (updatedBy === user._id) return;
      console.log("Socket: Task Updated", taskId);
      // Fetch fresh data to ensure consistency
      dispatch(getSingleTasksService(projectId, taskId, token));
    };

    // 5. Task Delete Event
    const handleTaskDelete = ({ taskId, deletedBy }) => {
      if (deletedBy === user._id) return;
      console.log("Socket: Task Deleted", taskId);
      dispatch(deleteTask(taskId));
    };

    // Attach Listeners
    socket.on("connect", onConnect);
    socket.on("TASK:MOVE", handleTaskMove);
    socket.on("TASK:CREATE", handleTaskCreate);
    socket.on("TASK:UPDATE", handleTaskUpdate);
    socket.on("TASK:DELETE", handleTaskDelete);

    // Cleanup
    return () => {
      console.log("Cleaning up socket listeners...");
      socket.off("connect", onConnect);
      socket.off("TASK:MOVE", handleTaskMove);
      socket.off("TASK:CREATE", handleTaskCreate);
      socket.off("TASK:UPDATE", handleTaskUpdate);
      socket.off("TASK:DELETE", handleTaskDelete);
      socket.disconnect();
    };
  }, [projectId, user?._id, dispatch, token]);

  useEffect(() => {
    if (projectId && token) {
      dispatch(fetchSingleProjectService(projectId, token));
    }
  }, [projectId, token, dispatch]);

  useEffect(() => {
    if (projectData?.data?._id && token) {
      dispatch(getAllTasksService(projectData.data._id, token));
    }
  }, [projectData?.data?._id, token, dispatch]);

  useEffect(() => {
    setTasks(taskList || []);
  }, [taskList]);

  useEffect(() => {
    if (projectData?.data?.projectName) {
      document.title = `${projectData.data.projectName} | NexManage`;
    } else {
      document.title = "Project Details | NexManage";
    }
  }, [projectData?.data?.projectName]);

  const onSubmit = (formData) => {
    dispatch(
      createTaskService(formData, projectId, token, setCreateTaskModalOpen)
    );
  };

  if (!projectData?.data) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        Loading project details...
      </div>
    );
  }

  return (
    <div className=" py-6 bg-gray-50 min-h-screen overflow-x-hidden min-w-0">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-4">
        <Link to="/dashboard/projects" className="hover:text-blue-600">Projects</Link> <span className="mx-1">›</span>
        <span className="text-gray-700">{projectData?.data?.projectName}</span>
      </div>

      <ProjectHeader project={projectData?.data} />

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
          projectMembers={projectData?.data?.projectMembers}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}
