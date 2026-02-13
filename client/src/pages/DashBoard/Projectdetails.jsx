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

  let Socket = useRef(null);

  useEffect(() => {
    Socket.current = connectWs();

    Socket.current.connect();

    Socket.current.on("connect", () => {
      console.log("connected to the server socket ----->"
      );

      // Socket.current.emit("client-message", "hello from client");

      Socket.current.on("server-message", (msg) => {
        console.log(" Message from server:", msg);
      });

      Socket.current.emit("join-project", { projectId });

      const handleTaskCreate = ({ taskId, createdBy }) => {
        if (createdBy === user._id) return;

        // console.log("TASK:CREATED RECEIVED ", taskId);

        dispatch(getSingleTasksService(projectId, taskId, token));
      };

      const handleTaskDelete = ({ taskId, createdBy }) => {
        if (createdBy === user._id) return;

        // console.log("TASK:DELETED RECEIVED ", taskId);

        dispatch(deleteTask(taskId));
      };

      const handleTaskUpdate = ({ taskId, createdBy }) => {
        if (createdBy === user._id) return;

        // console.log("TASK:UPDATE RECEIVED ", taskId);

        // dispatch(updateTask(updates))

        dispatch(getSingleTasksService(projectId, taskId, token));
      };

      const handleTaskMove = ({ taskId, fromStatus, toStatus }) => {
        // console.log("TASK:MOVE RECEIVED ", taskId);
        dispatch(moveTaskRealtime({ taskId, fromStatus, toStatus }));
      };

      Socket.current.on("TASK:CREATE", handleTaskCreate);
      Socket.current.on("TASK:DELETE", handleTaskDelete);
      Socket.current.on("TASK:UPDATE", handleTaskUpdate);
      Socket.current.on("TASK:MOVE", handleTaskMove);

      Socket.current.on("disconnect", () => {
        console.log(" Disconnected from server");
      });
    });

    // console.log("socket cureent==> ", Socket);

    return () => {
      Socket.current.off("connect");
      Socket.current.off("server-message");
      Socket.current.disconnect();
    };
  }, [projectId]);

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
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading project details...
      </div>
    );
  }

  return (
    <div className=" py-6 bg-gray-50 min-h-screen overflow-x-hidden min-w-0">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
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
