import React, { useEffect, useState, useMemo, useCallback } from "react";
import useScrollLock from "../../../hooks/useScrollLock";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteTaskService,
  fetchAllSubTaskService,
  fetchTaskActivityService,
  fetchTaskAttachmentsService,
  updateAssigneesTaskService,
  updateTaskService,
} from "../../../services/taskOperations/taskServices";

import CreateTaskModal from "./CreateTaskModal";
import TaskHeader from "./TaskHeader";
import TaskDescription from "./TaskDescription";
import TaskSubtasks from "./TaskSubtasks";
import TaskAttachments from "./TaskAttachments";
import TaskAssignees from "./TaskAssignees";
import TaskActivity from "./TaskActivity";

import {
  clearSelectedTaskAttachments,
  clearSelectedTaskSubtasks,
} from "../../../Redux_Config/Slices/tasksSlice";

import ConfirmModal from "../teamsModals/ConfirmModal";
import { canManageTask } from "../../../utils/permissions";
import ModalPortal from "../../ModalPortal";

const ANIMATION_DURATION = 350;

export default function TaskDetailModal({ task, onClose }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const project = useSelector((state) => state.projects.selectedProject);
  const projectMembers = project?.data?.projectMembers || [];

  const allTaskActivity = useSelector((state) => state.tasks.activityLogs);

  const { data: subtasks, loading: subtaskLoading } = useSelector(
    (state) => state.tasks.selectedTaskSubtasks,
  );

  const allTaskAssignee = useSelector(
    (state) => state.tasks.selectedTask?.data?.assignees || [],
  );

  const projectId = useMemo(() => {
    if (project?.data?._id) return project.data._id;

    if (typeof task?.project === "object") {
      return task?.project?._id;
    }

    return task?.project;
  }, [project, task]);

  const canManage = useMemo(
    () => canManageTask(user, projectMembers),
    [user, projectMembers],
  );

  const [visible, setVisible] = useState(false);

  useScrollLock(true);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, ANIMATION_DURATION);
  }, [onClose]);

  const assignees = useMemo(() => {
    if (!task?.assignees) return [];

    return task.assignees.map((a) => {
      if (typeof a === "object" && a.name) return a;

      const id = typeof a === "object" ? a._id : a;
      const member = projectMembers.find((m) => m.user?._id === id);
      return member?.user || { _id: id, name: "Unknown" };
    });
  }, [task?.assignees, projectMembers]);

  const [isAssignMode, setIsAssignMode] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [isSavingAssignees, setIsSavingAssignees] = useState(false);
  const [updateTaskModalOpen, setUpdateTaskModalOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState(null);

  useEffect(() => {
    if (!projectId || !task?._id || !token) return;

    dispatch(fetchAllSubTaskService(projectId, task._id, token));

    return () => {
      dispatch(clearSelectedTaskSubtasks());
    };
  }, [projectId, task?._id, token, dispatch]);

  useEffect(() => {
    if (!projectId || !task?._id || !token) return;

    dispatch(fetchTaskAttachmentsService(projectId, task._id, token));

    return () => {
      dispatch(clearSelectedTaskAttachments());
    };
  }, [projectId, task?._id, token, dispatch]);

  useEffect(() => {
    if (!projectId || !task?._id || !token) return;

    dispatch(fetchTaskActivityService(task._id, projectId, token));
  }, [projectId, task?._id, token, dispatch]);

  const handleDeleteTask = () => {
    setConfirmType("deleteTask");
    setConfirmOpen(true);
  };

  const handleConfirmAction = () => {
    if (confirmType === "deleteTask") {
      if (!projectId) return;

      dispatch(deleteTaskService(projectId, task._id, token));
      onClose();
    }

    setConfirmOpen(false);
    setConfirmType(null);
  };

  const handleUpdateTask = (formData) => {
    if (!projectId) return;

    dispatch(
      updateTaskService(
        formData,
        projectId,
        task._id,
        token,
        setUpdateTaskModalOpen,
      ),
    );
  };

  const handleSaveAssignees = async () => {
    if (!projectId) return;

    setIsSavingAssignees(true);

    await dispatch(
      updateAssigneesTaskService(selectedAssignees, projectId, task._id, token),
    );

    setIsAssignMode(false);
    setIsSavingAssignees(false);
  };

  if (subtaskLoading) {
    return (
      <ModalPortal>
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
          <div
            className="task-detail-backdrop absolute inset-0"
            style={{ opacity: visible ? 1 : 0 }}
          />
          <div className="relative flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-sm text-gray-400 font-medium">Loading task...</span>
          </div>
        </div>
      </ModalPortal>
    );
  }

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-3000 flex justify-end items-stretch overflow-hidden">
        {/* Backdrop */}
        <div
          className="task-detail-backdrop absolute inset-0"
          style={{ opacity: visible ? 1 : 0 }}
          onClick={handleClose}
          onTouchMove={(e) => e.preventDefault()}
        />

        {/* Panel */}
        <div
          className="task-detail-panel relative z-10 w-full h-full md:w-[85vw] lg:w-[75vw] max-w-6xl bg-white shadow-2xl flex flex-col md:overflow-hidden md:rounded-l-2xl"
          style={{
            transform: visible ? "translateX(0)" : "translateX(100%)",
            opacity: visible ? 1 : 0,
          }}
        >
          {/* Top accent gradient */}
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 shrink-0 md:rounded-tl-2xl" />

          {/* Header */}
          <div className="flex-none bg-white z-20 px-5 py-4 sm:px-8 sm:py-5 border-b border-gray-100 sticky top-0 md:static">
            <TaskHeader
              task={task}
              canManage={canManage}
              onEdit={() => setUpdateTaskModalOpen(true)}
              onDelete={handleDeleteTask}
              onClose={handleClose}
            />
          </div>

          {/* Content area */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Main content */}
            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 task-detail-scroll bg-gray-50/30">
              <div className="space-y-8 pb-10 max-w-3xl">
                <TaskDescription description={task.description} />
                <TaskSubtasks
                  subtasks={subtasks || []}
                  task={task}
                  canManage={canManage}
                />
                <TaskAttachments task={task} canManage={canManage} />

                {/* Mobile-only sidebar content */}
                <div className="md:hidden space-y-8 pt-6 border-t border-gray-200">
                  <TaskAssignees
                    assignees={assignees}
                    projectMembers={projectMembers}
                    isAssignMode={isAssignMode}
                    setIsAssignMode={setIsAssignMode}
                    selectedAssignees={selectedAssignees}
                    setSelectedAssignees={setSelectedAssignees}
                    onSave={handleSaveAssignees}
                    isSaving={isSavingAssignees}
                    canManage={canManage}
                  />
                  <TaskActivity activities={allTaskActivity?.list || []} />
                </div>
              </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden md:flex md:flex-col w-80 lg:w-96 border-l border-gray-100 bg-gradient-to-b from-gray-50/80 to-white overflow-y-auto task-detail-scroll">
              <div className="p-6 space-y-8">
                <TaskAssignees
                  assignees={assignees}
                  projectMembers={projectMembers}
                  isAssignMode={isAssignMode}
                  setIsAssignMode={setIsAssignMode}
                  selectedAssignees={selectedAssignees}
                  setSelectedAssignees={setSelectedAssignees}
                  onSave={handleSaveAssignees}
                  isSaving={isSavingAssignees}
                  canManage={canManage}
                />

                <div className="h-px bg-gray-100" />

                <TaskActivity activities={allTaskActivity?.list || []} />
              </div>
            </div>
          </div>
        </div>

        <CreateTaskModal
          isOpen={updateTaskModalOpen}
          onClose={setUpdateTaskModalOpen}
          onSubmit={handleUpdateTask}
          mode="edit"
          editableData={task}
        />

        <ConfirmModal
          open={confirmOpen}
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirmOpen(false)}
        />
      </div>
    </ModalPortal>
  );
}

