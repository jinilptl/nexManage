import React, { useEffect, useState, useMemo, useCallback } from "react";
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

const ANIMATION_DURATION = 350; // ms — keep in sync with CSS transition duration

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

  // ── Animation state ──────────────────────────────────────────
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.body.classList.add("modal-open");

    // Trigger enter animation on next frame so CSS transition fires
    const raf = requestAnimationFrame(() => setVisible(true));

    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove("modal-open");
    };
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, ANIMATION_DURATION);
  }, [onClose]);

  // ── Data fetching ────────────────────────────────────────────
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
          <div className="relative text-sm text-gray-400">
            Loading subtasks...
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
        />

        {/* Panel */}
        <div
          className="task-detail-panel relative z-10 w-full h-full md:w-[85vw] lg:w-[75vw] max-w-6xl bg-white shadow-2xl flex flex-col md:overflow-hidden md:rounded-l-3xl border-l border-gray-100"
          style={{
            transform: visible ? "translateX(0)" : "translateX(100%)",
            opacity: visible ? 1 : 0,
          }}
        >
          <div className="flex-none bg-white z-20 border-b border-gray-100 px-4 py-3 sm:px-6 sm:py-5 sticky top-0 md:static">
            <TaskHeader
              task={task}
              canManage={canManage}
              onEdit={() => setUpdateTaskModalOpen(true)}
              onDelete={handleDeleteTask}
              onClose={handleClose}
            />
          </div>

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 scrollbar-hide bg-white">
              <div className="space-y-8 pb-10">
                <TaskDescription description={task.description} />
                <TaskSubtasks
                  subtasks={subtasks || []}
                  task={task}
                  canManage={canManage}
                />
                <TaskAttachments task={task} canManage={canManage} />

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

