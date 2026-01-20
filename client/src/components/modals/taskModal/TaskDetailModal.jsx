import React, { useEffect } from "react";
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

export default function TaskDetailModal({ task, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const project = useSelector((state) => state.projects.selectedProject);

  const projectMembers = project?.data?.projectMembers || [];
  const allTaskActivity = useSelector((state) => state.tasks.activityLogs);

  const {
    taskId,
    data: subtasks,
    loading: subtaskLoading,
  } = useSelector((state) => state.tasks.selectedTaskSubtasks);

  const allTaskAssignee = useSelector(
    (state) => state.tasks.selectedTask?.data?.assignees || []
  );

  const [attachments, setAttachments] = React.useState(task.attachments || []);
  const [assignees, setAssignees] = React.useState(task.assignees || []);
  const [isAssignMode, setIsAssignMode] = React.useState(false);
  const [selectedAssignees, setSelectedAssignees] = React.useState([]);
  const [isSavingAssignees, setIsSavingAssignees] = React.useState(false);
  const [updateTaskModalOpen, setUpdateTaskModalOpen] = React.useState(false);


  //  FETCH SUBTASKS ON MODAL
  useEffect(() => {
    if (task?._id && token) {
      dispatch(fetchAllSubTaskService(task.project, task._id, token));
    }
    return () => {
      dispatch(clearSelectedTaskSubtasks());
    };
  }, [task._id, task.project, token, dispatch]);

  useEffect(() => {
    // console.log("useeefct run");

    if (task?._id && token) {
      // console.log("fetch taskattech ment inuseeefect run");
      dispatch(fetchTaskAttachmentsService(task.project, task._id, token));
    }

    return () => {
      // console.log("fetch taskattech ment return inuseeefect run");

      dispatch(clearSelectedTaskAttachments());
    };
  }, [task._id, token]);

  const handleDeleteTask = () => {
    if (confirm("do you want to delete this task??")) {
      dispatch(deleteTaskService(task.project, task._id, token));
      onClose();
    }
  };

  useEffect(() => {
    if (token) {
      dispatch(fetchTaskActivityService(task._id, task.project, token));
    }
  }, []);

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
      <div className="fixed inset-0 z-5555 flex items-center justify-center">
        <div className="text-sm text-gray-400">Loading subtasks...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-5555 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative z-10 h-[100dvh] w-full md:h-[90vh] md:max-w-6xl bg-white rounded-none md:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
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

          <TaskAttachments
            task={task}
            // attachments={attachments}
            // setAttachments={setAttachments}
          />
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
    </div>
  );
}
