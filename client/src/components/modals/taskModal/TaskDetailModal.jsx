import React, { useEffect, useState } from "react";
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
import toast from "react-hot-toast";

export default function TaskDetailModal({ task, onClose }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const project = useSelector((state) => state.projects.selectedProject);

  const projectMembers = project?.data?.projectMembers || [];
  const allTaskActivity = useSelector((state) => state.tasks.activityLogs);

  const {
    data: subtasks,
    loading: subtaskLoading,
  } = useSelector((state) => state.tasks.selectedTaskSubtasks);

  const allTaskAssignee = useSelector(
    (state) => state.tasks.selectedTask?.data?.assignees || []
  );

  const [attachments] = useState(task.attachments || []);
  const [assignees, setAssignees] = useState(task.assignees || []);
  const [isAssignMode, setIsAssignMode] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [isSavingAssignees, setIsSavingAssignees] = useState(false);
  const [updateTaskModalOpen, setUpdateTaskModalOpen] = useState(false);

  /* -------- CONFIRM MODAL STATES -------- */
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState(null);

  /* -------- FETCH SUBTASKS -------- */
  useEffect(() => {
    if (task?._id && token) {
      dispatch(fetchAllSubTaskService(task.project, task._id, token));
    }
    return () => {
      dispatch(clearSelectedTaskSubtasks());
    };
  }, [task._id, task.project, token, dispatch]);

  /* -------- FETCH ATTACHMENTS -------- */
  useEffect(() => {
    if (task?._id && token) {
      dispatch(fetchTaskAttachmentsService(task.project, task._id, token));
    }
    return () => {
      dispatch(clearSelectedTaskAttachments());
    };
  }, [task._id, token, dispatch]);

  /* -------- FETCH ACTIVITY -------- */
  useEffect(() => {
    if (token) {
      dispatch(fetchTaskActivityService(task._id, task.project, token));
    }
  }, [task._id, task.project, token, dispatch]);

  /* -------- DELETE TASK (OPEN CONFIRM) -------- */
  const handleDeleteTask = () => {
    setConfirmType("deleteTask");
    setConfirmOpen(true);
  };

  /* -------- CONFIRM ACTION -------- */
  const handleConfirmAction = () => {
    if (confirmType === "deleteTask") {
      dispatch(deleteTaskService(task.project, task._id, token));
      onClose();
    }

    setConfirmOpen(false);
    setConfirmType(null);
  };

  const handleUpdateTask = (formData) => {
    dispatch(
      updateTaskService(
        formData,
        task.project,
        task._id,
        token,
        setUpdateTaskModalOpen
      )
    );
  };

  const handleSaveAssignees = async () => {
    setIsSavingAssignees(true);

    dispatch(
      updateAssigneesTaskService(
        selectedAssignees,
        task.project,
        task._id,
        token
      )
    );

    setAssignees(allTaskAssignee);
    setIsAssignMode(false);
    setIsSavingAssignees(false);
  };

  if (subtaskLoading) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm modal-backdrop-enter" />
        <div className="relative text-sm text-gray-400 modal-content-enter">
          Loading subtasks...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm modal-backdrop-enter"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-6xl h-[95vh] sm:h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden modal-content-enter">
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
            projectMembers={projectMembers}
            isAssignMode={isAssignMode}
            setIsAssignMode={setIsAssignMode}
            selectedAssignees={selectedAssignees}
            setSelectedAssignees={setSelectedAssignees}
            onSave={handleSaveAssignees}
            isSaving={isSavingAssignees}
          />

          <TaskActivity
            activities={
              allTaskActivity.list || ["Task created", "Assignees updated"]
            }
          />
        </div>
      </div>

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
