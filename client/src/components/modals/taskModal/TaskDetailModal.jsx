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

export default function TaskDetailModal({ task, onClose }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const project = useSelector((state) => state.projects.selectedProject);

  const allTaskActivity = useSelector((state) => state.tasks.activityLogs);

  const {
    data: subtasks,
    loading: subtaskLoading,
  } = useSelector((state) => state.tasks.selectedTaskSubtasks);

  const allTaskAssignee = useSelector(
    (state) => state.tasks.selectedTask?.data?.assignees || []
  );

  /* ---------------- SAFE PROJECT ID ---------------- */

  const projectId = useMemo(() => {
    if (project?.data?._id) return project.data._id;

    if (typeof task?.project === "object") {
      return task?.project?._id;
    }

    return task?.project;
  }, [project, task]);

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
        setUpdateTaskModalOpen
      )
    );
  };

  /* ---------------- UPDATE ASSIGNEES ---------------- */

  const handleSaveAssignees = async () => {
    if (!projectId) return;

    setIsSavingAssignees(true);

    await dispatch(
      updateAssigneesTaskService(
        selectedAssignees,
        projectId,
        task._id,
        token
      )
    );

    setAssignees(allTaskAssignee);
    setIsAssignMode(false);
    setIsSavingAssignees(false);
  };

  /* ---------------- LOADING ---------------- */

  if (subtaskLoading) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative text-sm text-gray-400">
          Loading subtasks...
        </div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-6xl h-[95vh] sm:h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <TaskHeader
            task={task}
            onEdit={() => setUpdateTaskModalOpen(true)}
            onDelete={handleDeleteTask}
            onClose={onClose}
          />

          <TaskDescription description={task.description} />
          <TaskSubtasks subtasks={subtasks || []} task={task} />
          <TaskAttachments task={task} />
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l bg-gray-50 p-4 sm:p-6">
          <TaskAssignees
            assignees={assignees}
            projectMembers={project?.data?.projectMembers || []}
            isAssignMode={isAssignMode}
            setIsAssignMode={setIsAssignMode}
            selectedAssignees={selectedAssignees}
            setSelectedAssignees={setSelectedAssignees}
            onSave={handleSaveAssignees}
            isSaving={isSavingAssignees}
          />

          <TaskActivity
            activities={
              allTaskActivity?.list || []
            }
          />
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
  );
}
