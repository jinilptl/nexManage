import React, { useEffect, useRef, useState, useMemo } from "react";
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
import { Plus, Eye, X } from "lucide-react";
import {
  deleteTask,
  moveTaskRealtime,
  updateTask,
} from "../../Redux_Config/Slices/tasksSlice";
import NexManageLoader from "../../components/Lodders/NexManageLoader";
import InviteProjectMemberModal from "../../components/modals/projectModals/InviteProjectMemberModal";
import Avatar from "../../components/common/Avatar";

import { Home, ChevronRight } from "lucide-react";

export default function ProjectDetails() {
  const [activeTab, setActiveTab] = useState("board");
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [showObserversList, setShowObserversList] = useState(false);
  const projectData = useSelector((state) => state.projects.selectedProject);
  const addMemberLoading = useSelector((state) => state.projects.projectMembers.addMemberLoading);
  const taskList = useSelector((state) => state.tasks.list);
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const UserRole = user.role;

  const isObserver = useMemo(() => {
    if (!user || !projectData?.data) return false;
    if (user.isTempMember) return true;
    const members = projectData.data.projectMembers || [];
    const currentMember = members.find(
      (m) => (m.user?._id || m.user) === user._id
    );
    return currentMember?.roleInProject === "observer";
  }, [user, projectData]);

  const isProjectManagerOrAdmin = useMemo(() => {
    if (!user || !projectData?.data) return false;
    if (user.role === "super_admin" || user.role === "admin") return true;
    const pm = projectData.data.projectManager;
    if (pm && (pm.toString() === user._id || pm._id === user._id)) return true;
    const members = projectData.data.projectMembers || [];
    const currentMember = members.find(
      (m) => (m.user?._id || m.user) === user._id
    );
    return currentMember?.roleInProject === "project-manager";
  }, [user, projectData]);

  const observers = useMemo(() => {
    if (!projectData?.data?.projectMembers) return [];
    return projectData.data.projectMembers.filter(
      (m) => m.roleInProject === "observer" && m.status === "active"
    );
  }, [projectData]);

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

    const onConnect = () => {
      socket.emit("join-project", { projectId });
    };

    const onError = (err) => {
      console.error("Socket Connection Error:", err);
    };

    const handleTaskMove = ({ taskId, toStatus, updatedBy }) => {
      if (updatedBy === user._id) return;
      dispatch(moveTaskRealtime({ taskId, toStatus }));
    };

    const handleTaskCreate = ({ taskId, createdBy }) => {
      if (createdBy === user._id) return;
      dispatch(getSingleTasksService(projectId, taskId, token));
    };

    const handleTaskUpdate = ({ taskId, updatedBy }) => {
      if (updatedBy === user._id) return;
      dispatch(getSingleTasksService(projectId, taskId, token));
    };

    const handleTaskDelete = ({ taskId, deletedBy }) => {
      if (deletedBy === user._id) return;
      dispatch(deleteTask(taskId));
    };

    const handleTaskAssigneesUpdated = ({ taskId, updatedTask }) => {
      dispatch(updateTask(updatedTask));
    };

    socket.on("connect", onConnect);
    socket.on("connect_error", onError);
    socket.on("TASK:MOVE", handleTaskMove);
    socket.on("TASK:CREATE", handleTaskCreate);
    socket.on("TASK:UPDATE", handleTaskUpdate);
    socket.on("TASK:DELETE", handleTaskDelete);
    socket.on("TASK_ASSIGNEES_UPDATED", handleTaskAssigneesUpdated);

    socket.connect();

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

        <div className="flex items-center gap-3 mr-6">
          {/* Observer badge for observer users */}
          {isObserver && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs font-medium">
              <Eye className="w-3.5 h-3.5" />
              Read-Only Access
            </div>
          )}

          {/* Observers list toggle — visible to admin/super_admin/PM only */}
          {isProjectManagerOrAdmin && observers.length > 0 && (
            <button
              onClick={() => setShowObserversList(!showObserversList)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-gray-700 text-xs font-medium transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              {observers.length} Observer{observers.length !== 1 ? "s" : ""}
            </button>
          )}

          {/* Invite Observer button — NOT shown to observers or members */}
          {!isObserver && UserRole !== "member" && (
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
      </div>

      {/* Observers List Panel — only for admin/super_admin/PM */}
      {isProjectManagerOrAdmin && showObserversList && observers.length > 0 && (
        <div className="mx-6 mb-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-800">
                Project Observers
              </h3>
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                {observers.length}
              </span>
            </div>
            <button
              onClick={() => setShowObserversList(false)}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {observers.map((obs, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <Avatar
                  user={obs.user}
                  className="w-8 h-8 text-xs border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {obs.user?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {obs.user?.email || ""}
                  </p>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full">
                  Observer
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <ProjectHeader project={projectData?.data} />

      <ProjectTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <ProjectContent
        activeTab={activeTab}
        tasks={tasks}
        setTasks={setTasks}
        reorderTaskInColumn={reorderTaskInColumn}
        onModalOpen={setCreateTaskModalOpen}
        modalOpen={createTaskModalOpen}
        isObserver={isObserver}
      />

      {createTaskModalOpen && !isObserver && (
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
