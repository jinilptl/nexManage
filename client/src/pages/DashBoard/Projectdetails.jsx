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
import { addProjectMemberService } from "../../services/projectsOperations/projectsServices";
import { Link, useParams } from "react-router-dom";
import { fetchSingleProjectService } from "../../services/projectsOperations/projectsServices";
import { connectWs } from "../../sockets/socket";
import { Plus } from "lucide-react";
import {
  deleteTask,
  moveTaskRealtime,
  updateTask,
} from "../../Redux_Config/Slices/tasksSlice";
import NexManageLoader from "../../components/Lodders/NexManageLoader";
import InviteProjectMemberModal from "../../components/modals/projectModals/InviteProjectMemberModal";


import { Home, ChevronRight } from "lucide-react";

export default function ProjectDetails() {
  const [activeTab, setActiveTab] = useState("board");
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const projectData = useSelector((state) => state.projects.selectedProject);
  const addMemberLoading = useSelector((state) => state.projects.projectMembers.addMemberLoading);
  const taskList = useSelector((state) => state.tasks.list);
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const UserRole = user.role;

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

    const socket = connectWs(token);

    // 1. Connection Event (Re-join room on reconnect)
    const onConnect = () => {
      // console.log("Socket Connected:", socket.id);
      socket.emit("join-project", { projectId });
    };

    const onError = (err) => {
      console.error("Socket Connection Error:", err);
    };

    // 2. Task Move Event
    const handleTaskMove = ({ taskId, toStatus, updatedBy }) => {
      if (updatedBy === user._id) return;
      dispatch(moveTaskRealtime({ taskId, toStatus }));
    };

    // 3. Task Create Event
    const handleTaskCreate = ({ taskId, createdBy }) => {
      if (createdBy === user._id) return;
      dispatch(getSingleTasksService(projectId, taskId, token));
    };

    // 4. Task Update Event (General updates)
    const handleTaskUpdate = ({ taskId, updatedBy }) => {
      if (updatedBy === user._id) return;
      dispatch(getSingleTasksService(projectId, taskId, token));
    };

    // 5. Task Delete Event
    const handleTaskDelete = ({ taskId, deletedBy }) => {
      if (deletedBy === user._id) return;
      dispatch(deleteTask(taskId));
    };

    // 6. Task Assignees Updated
    const handleTaskAssigneesUpdated = ({ taskId, updatedTask }) => {
      // Dispatch updateTask to update the list and selectedTask
      // We assume updatedTask is fully populated as per backend contract
      dispatch(updateTask(updatedTask));
    };

    // Attach Listeners
    socket.on("connect", onConnect);
    socket.on("connect_error", onError);
    socket.on("TASK:MOVE", handleTaskMove);
    socket.on("TASK:CREATE", handleTaskCreate);
    socket.on("TASK:UPDATE", handleTaskUpdate);
    socket.on("TASK:DELETE", handleTaskDelete);
    socket.on("TASK_ASSIGNEES_UPDATED", handleTaskAssigneesUpdated);

    socket.connect();

    // Cleanup
    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onError);
      socket.off("TASK:MOVE", handleTaskMove);
      socket.off("TASK:CREATE", handleTaskCreate);
      socket.off("TASK:UPDATE", handleTaskUpdate);
      socket.off("TASK:DELETE", handleTaskDelete);
      socket.off("TASK_ASSIGNEES_UPDATED", handleTaskAssigneesUpdated);
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
      createTaskService(formData, projectId, token, setCreateTaskModalOpen),
    );
  };

  const onInviteSubmit = (formData) => {
    dispatch(
      addProjectMemberService(projectId, formData, token, setInviteModalOpen)
    );
  };

  if (!projectData?.data) {
    return (
      <div className=" flex justify-center items-center h-[70vh]">
        <NexManageLoader />
      </div>
    );
  }

  return (
    <div className=" py-6 bg-gray-50 min-h-screen overflow-x-hidden min-w-0">

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-6 bg-white px-4 py-3 mx-6 rounded-xl border border-gray-100 shadow-sm w-fit">
          <Link to="/dashboard/projects" className="hover:text-blue-600 transition-colors">
            Projects
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <span className="font-medium text-gray-900 truncate max-w-[200px]">
            {projectData?.data?.projectName}
          </span>
        </nav>

        {UserRole !== "member" && (
          <button
            onClick={() => {
              setInviteModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer flex items-center gap-2 text-sm hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Invite Observer
          </button>
        )}
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

      {inviteModalOpen && (
        <InviteProjectMemberModal
          isOpen={inviteModalOpen}
          onClose={setInviteModalOpen}
          onSubmit={onInviteSubmit}
          loading={addMemberLoading}
        />
      )}
    </div>
  );
}
