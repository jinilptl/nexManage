import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,

  selectedTaskId: null,

  selectedTask: {
    data: null,
    loading: false,
    error: null,
  },

  orderUpdating: false,

  activityLogs: {
    list: [],
    loading: false,
    error: null,
  },

  subtasksByTaskId: {},
  attachmentsByTaskId: {},
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // TASK LIST

    setLoading(state,action){
      state.loading=action.payload

    },

    setAllTasks(state, action) {
      state.list = action.payload;
    },

    addTask(state, action) {
      
      state.list.unshift(action.payload);
    },

    updateTask(state, action) {
      const updatedTask = action.payload;

      state.list = state.list.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      );

      if (state.selectedTaskId === updatedTask._id) {
        state.selectedTask.data = updatedTask;
      }
    },

    deleteTask(state, action) {
      const taskId = action.payload;
      state.list = state.list.filter((task) => task._id !== taskId);

      if (state.selectedTaskId === taskId) {
        state.selectedTaskId = null;
        state.selectedTask.data = null;
      }
    },

    // SELECTED TASK

    setSelectedTaskId(state, action) {
      state.selectedTaskId = action.payload;
    },

    clearSelectedTask(state) {
      state.selectedTaskId = null;
      state.selectedTask.data = null;
      state.selectedTask.error = null;
    },

    setSelectedTask(state, action) {
      state.selectedTask.data = action.payload;
    },

    // KANBAN ORDER / STATUS

    setReorderTasksInColumn(state, action) {
      const { columnId, reorderedTasks } = action.payload;

      // Map for quick lookup
      const reorderedMap = new Map(
        reorderedTasks.map((task, index) => [
          task._id,
          { ...task, order: index },
        ])
      );

      state.list = state.list.map((task) => {
        if (task.status === columnId && reorderedMap.has(task._id)) {
          return reorderedMap.get(task._id);
        }
        return task;
      });
    },

    setUpdateTaskStatus(state, action) {
      const { taskId, status, order } = action.payload;
      const task = state.list.find((t) => t._id === taskId);

      if (task) {
        task.status = status;
        if (order !== undefined) {
          task.order = order;
        }
      }
    },

    // SUBTASKS

    setSubtasks(state, action) {
      const { taskId, subtasks } = action.payload;
      state.subtasksByTaskId[taskId] = subtasks;
    },

    addSubtask(state, action) {
      const { taskId, subtask } = action.payload;
      if (!state.subtasksByTaskId[taskId]) {
        state.subtasksByTaskId[taskId] = [];
      }
      state.subtasksByTaskId[taskId].push(subtask);
    },

    updateSubtask(state, action) {
      const { taskId, subtask } = action.payload;
      state.subtasksByTaskId[taskId] = state.subtasksByTaskId[taskId]?.map(
        (s) => (s._id === subtask._id ? subtask : s)
      );
    },

    deleteSubtask(state, action) {
      const { taskId, subtaskId } = action.payload;
      state.subtasksByTaskId[taskId] = state.subtasksByTaskId[taskId]?.filter(
        (s) => s._id !== subtaskId
      );
    },

    // ATTACHMENTS

    setAttachments(state, action) {
      const { taskId, attachments } = action.payload;
      state.attachmentsByTaskId[taskId] = attachments;
    },

    addAttachment(state, action) {
      const { taskId, attachment } = action.payload;
      if (!state.attachmentsByTaskId[taskId]) {
        state.attachmentsByTaskId[taskId] = [];
      }
      state.attachmentsByTaskId[taskId].push(attachment);
    },

    deleteAttachment(state, action) {
      const { taskId, attachmentId } = action.payload;
      state.attachmentsByTaskId[taskId] = state.attachmentsByTaskId[
        taskId
      ]?.filter((a) => a._id !== attachmentId);
    },

    // ACTIVITY LOGS

    setActivityLogs(state, action) {
      state.activityLogs.list = action.payload;
    },

    addActivityLog(state, action) {
      state.activityLogs.list.unshift(action.payload);
    },

    clearActivityLogs(state) {
      state.activityLogs.list = [];
      state.activityLogs.error = null;
    },
  },
});

export const {
  setLoading,
  setAllTasks,
  addTask,
  updateTask,
  deleteTask,

  setSelectedTaskId,
  clearSelectedTask,
  setSelectedTask,

  setReorderTasksInColumn,
  setUpdateTaskStatus,

  setSubtasks,
  addSubtask,
  updateSubtask,
  deleteSubtask,

  setAttachments,
  addAttachment,
  deleteAttachment,

  setActivityLogs,
  addActivityLog,
  clearActivityLogs,
} = taskSlice.actions;

export default taskSlice.reducer;
