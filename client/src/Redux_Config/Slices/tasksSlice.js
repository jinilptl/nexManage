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

  selectedTaskSubtasks: {
    taskId: null,
    data: null,
    loading: false,
  },
  selectedTaskAttachments: {
    taskId: null,
    data: [],
    loading: false,
  },
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // TASK LIST

    setLoading(state, action) {
      state.loading = action.payload;
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
        task._id === updatedTask._id ? updatedTask : task,
      );

      if (state.selectedTaskId === updatedTask._id) {
        state.selectedTask.data = updatedTask;
      }
    },

    upsertTask(state, action) {
      const index = state.list.findIndex(
        (task) => task._id === action.payload._id,
      );

      if (index === -1) {
        state.list.unshift(action.payload);
      } else {
        state.list[index] = action.payload;
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

      const reorderedMap = new Map(
        reorderedTasks.map((task, index) => [
          task._id,
          { ...task, order: index },
        ]),
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

    moveAllTasksToStatus(state, action) {
      const { fromStatusId, toStatusId } = action.payload;
      state.list = state.list.map((task) => {
        if (task.status === fromStatusId) {
          return { ...task, status: toStatusId };
        }
        return task;
      });
    },

    moveTaskRealtime(state, action) {
      const { taskId, toStatus } = action.payload;

      const movedTaskIndex = state.list.findIndex(
        (taskItem) => taskItem._id.toString() === taskId.toString(),
      );

      if (movedTaskIndex === -1) return;

      const movedTask = state.list[movedTaskIndex];

      if (movedTask.status === toStatus) return;

      state.list.splice(movedTaskIndex, 1);

      movedTask.status = toStatus;

      const tasksInTargetColumn = state.list.filter(
        (taskItem) => taskItem.status === toStatus,
      );

      if (tasksInTargetColumn.length === 0) {
        state.list.push(movedTask);
      } else {
        const lastTaskInTargetColumn =
          tasksInTargetColumn[tasksInTargetColumn.length - 1];

        const lastTaskGlobalIndex = state.list.findIndex(
          (taskItem) => taskItem._id === lastTaskInTargetColumn._id,
        );

        state.list.splice(lastTaskGlobalIndex + 1, 0, movedTask);
      }
    },

    // SUBTASKS

    setSubtasks(state, action) {
      const { taskId, subtasks } = action.payload;

      state.selectedTaskSubtasks.taskId = taskId;
      state.selectedTaskSubtasks.data = subtasks;
    },
    addSubtask(state, action) {
      const { taskId, subtask } = action.payload;

      if (state.selectedTaskSubtasks.taskId !== taskId) return;

      if (!Array.isArray(state.selectedTaskSubtasks.data)) {
        state.selectedTaskSubtasks.data = [];
      }

      state.selectedTaskSubtasks.data.push(subtask);
    },
    updateSubtask(state, action) {
      const { taskId, subtask } = action.payload;

      if (state.selectedTaskSubtasks.taskId !== taskId) return;

      state.selectedTaskSubtasks.data =
        state.selectedTaskSubtasks.data?.map((s) => {
          return s._id === subtask._id ? subtask : s;
        }) || [];
    },

    deleteSubtask(state, action) {
      const { taskId, subtaskId } = action.payload;

      if (state.selectedTaskSubtasks.taskId !== taskId) return;

      state.selectedTaskSubtasks.data =
        state.selectedTaskSubtasks.data?.filter((s) => s._id !== subtaskId) ||
        [];
    },
    clearSelectedTaskSubtasks(state) {
      state.selectedTaskSubtasks = {
        taskId: null,
        data: null,
        loading: false,
      };
    },
    setSubtaskLoading(state, action) {
      state.selectedTaskSubtasks.loading = action.payload;
    },

    // ATTACHMENTS

    setAttachments(state, action) {
      const { taskId, attachments } = action.payload;

      state.selectedTaskAttachments.taskId = taskId;
      state.selectedTaskAttachments.data = attachments;
    },

    addAttachment(state, action) {
      const { taskId, attachment } = action.payload;
      if (state.selectedTaskAttachments.taskId !== taskId) return;

      state.selectedTaskAttachments.data.unshift(attachment);
    },

    deleteAttachment(state, action) {
      const { taskId, attachmentId } = action.payload;

      if (state.selectedTaskAttachments.taskId !== taskId) return;
      state.selectedTaskAttachments.data =
        state.selectedTaskAttachments.data.filter((attechment) => {
          return attechment._id !== attachmentId;
        });
    },
    setAttachmentLoading(state, action) {
      state.selectedTaskAttachments.loading = action.payload;
    },
    clearSelectedTaskAttachments(state) {
      state.selectedTaskAttachments = {
        data: [],
        taskId: null,
        loading: false,
      };
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
  upsertTask,

  setSelectedTaskId,
  clearSelectedTask,
  setSelectedTask,

  setReorderTasksInColumn,
  setUpdateTaskStatus,
  moveAllTasksToStatus,
  moveTaskRealtime,

  setSubtasks,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  clearSelectedTaskSubtasks,
  setSubtaskLoading,

  setAttachments,
  addAttachment,
  setAttachmentLoading,
  deleteAttachment,
  clearSelectedTaskAttachments,

  setActivityLogs,
  addActivityLog,
  clearActivityLogs,
} = taskSlice.actions;

export default taskSlice.reducer;
