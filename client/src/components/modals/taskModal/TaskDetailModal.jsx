import React, { useEffect, useState, useMemo } from "react";
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

  /* ---------------- SAFE PROJECT ID ---------------- */

  const projectId = useMemo(() => {
    if (project?.data?._id) return project.data._id;

    if (typeof task?.project === "object") {
      return task?.project?._id;
    }

    return task?.project;
  }, [project, task]);

  /* ---------------- PERMISSIONS ---------------- */

  const canManage = useMemo(
    () => canManageTask(user, projectMembers),
    [user, projectMembers],
  );

  /* ---------------- BODY SCROLL LOCK ---------------- */

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  /* ---------------- LOCAL STATE ---------------- */

  const [assignees, setAssignees] = useState(task.assignees || []);
  const [isAssignMode, setIsAssignMode] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [isSavingAssignees, setIsSavingAssignees] = useState(false);
  const [updateTaskModalOpen, setUpdateTaskModalOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState(null);

  /* ---------------- FETCH SUBTASKS ---------------- */

  useEffect(() => {
    if (!projectId || !task?._id || !token) return;

    dispatch(fetchAllSubTaskService(projectId, task._id, token));

    return () => {
      dispatch(clearSelectedTaskSubtasks());
    };
  }, [projectId, task?._id, token, dispatch]);

  /* ---------------- FETCH ATTACHMENTS ---------------- */

  useEffect(() => {
    if (!projectId || !task?._id || !token) return;

    dispatch(fetchTaskAttachmentsService(projectId, task._id, token));

    return () => {
      dispatch(clearSelectedTaskAttachments());
    };
  }, [projectId, task?._id, token, dispatch]);

  /* ---------------- FETCH ACTIVITY ---------------- */

  useEffect(() => {
    if (!projectId || !task?._id || !token) return;

    dispatch(fetchTaskActivityService(task._id, projectId, token));
  }, [projectId, task?._id, token, dispatch]);

  /* ---------------- DELETE TASK ---------------- */

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

  /* ---------------- UPDATE TASK ---------------- */

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

  /* ---------------- UPDATE ASSIGNEES ---------------- */

  const handleSaveAssignees = async () => {
    if (!projectId) return;

    setIsSavingAssignees(true);

    await dispatch(
      updateAssigneesTaskService(selectedAssignees, projectId, task._id, token),
    );

    setAssignees(allTaskAssignee);
    setIsAssignMode(false);
    setIsSavingAssignees(false);
  };

  /* ---------------- LOADING ---------------- */

  if (subtaskLoading) {
    return (
      <ModalPortal>
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative text-sm text-gray-400">
            Loading subtasks...
          </div>
        </div>
      </ModalPortal>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-3000 flex justify-end items-stretch overflow-hidden">
        {/* BACKDROP */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />

        {/* SIDE DRAWER MODAL - FLEX COLUMN */}
        <div className="relative z-10 w-full h-full md:w-[85vw] lg:w-[75vw] max-w-6xl bg-white shadow-2xl flex flex-col md:overflow-hidden animate-slide-in-right md:rounded-l-3xl border-l border-gray-100">

          {/* 1. HEADER (Sticky on Mobile, Static on Desktop) */}
          <div className="flex-none bg-white z-20 border-b border-gray-100 px-4 py-3 sm:px-6 sm:py-5 sticky top-0 md:static">
            <TaskHeader
              task={task}
              canManage={canManage}
              onEdit={() => setUpdateTaskModalOpen(true)}
              onDelete={handleDeleteTask}
              onClose={onClose}
            />
          </div>

          {/* 2. CONTENT BODY (Flex Row for Desktop Side-by-Side) */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white">

            {/* LEFT: Main Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 scrollbar-hide bg-white">
              <div className="space-y-8 pb-10">
                <TaskDescription description={task.description} />
                <TaskSubtasks
                  subtasks={subtasks || []}
                  task={task}
                  canManage={canManage}
                />
                <TaskAttachments task={task} canManage={canManage} />

                {/* Mobile Only: Meta & Activity */}
                <div className="md:hidden space-y-8 pt-6 border-t border-gray-100">
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

            {/* RIGHT: Sidebar (Desktop Only) */}
            <div className="hidden md:block w-96 border-l border-gray-100 bg-gray-50/80 p-6 overflow-y-auto scrollbar-hide">
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

              <div className="mt-8">
                <TaskActivity activities={allTaskActivity?.list || []} />
              </div>
            </div>

          </div>
        </div>

        {/* EDIT TASK MODAL */}
        <CreateTaskModal
          isOpen={updateTaskModalOpen}
          onClose={setUpdateTaskModalOpen}
          onSubmit={handleUpdateTask}
          mode="edit"
          editableData={task}
        />

        {/* CONFIRM MODAL */}
        <ConfirmModal
          open={confirmOpen}
          title="Delete Task"
          message="Are you sure you want to delete this task?"
          confirmText="Yes"
          cancelText="Cancel"
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirmOpen(false)}
        />
      </div>
    </ModalPortal>
  );
}
