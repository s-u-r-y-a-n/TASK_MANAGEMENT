import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  taskLists: [],
  tasks: [],
  starredTasks: [],
  starredTasksLoaded: false,
  selectedListIds: [],
  filters: {
    search: "",
    priority: "",
    status: "",
    dueDate: "",
  },
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTasksLists: (state, action) => {
      state.taskLists = action.payload;
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    setStarredTasks: (state, action) => {
      state.starredTasks = action.payload;
      state.starredTasksLoaded = true;
    },
    addStarredTask: (state, action) => {
      const task = action.payload;
      if (!task?.starred) return;

      const existingIndex = state.starredTasks.findIndex(
        (currentTask) => currentTask._id === task._id,
      );

      if (existingIndex === -1) {
        state.starredTasks.unshift(task);
      } else {
        state.starredTasks[existingIndex] = task;
      }
    },
    removeStarredTask: (state, action) => {
      state.starredTasks = state.starredTasks.filter(
        (task) => task._id !== action.payload,
      );
    },
    setTaskStarred: (state, action) => {
      const { taskId, starred, task } = action.payload;

      state.tasks = state.tasks.map((currentTask) =>
        currentTask._id === taskId
          ? { ...currentTask, starred }
          : currentTask,
      );

      if (starred) {
        const taskToStar =
          task || state.tasks.find((currentTask) => currentTask._id === taskId);
        if (!taskToStar) return;

        const starredTask = { ...taskToStar, starred: true };
        const existingIndex = state.starredTasks.findIndex(
          (currentTask) => currentTask._id === taskId,
        );

        if (existingIndex === -1) {
          state.starredTasks.unshift(starredTask);
        } else {
          state.starredTasks[existingIndex] = starredTask;
        }
      } else {
        state.starredTasks = state.starredTasks.filter(
          (task) => task._id !== taskId,
        );
      }
    },
    setSelectedListIds: (state, action) => {
      state.selectedListIds = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
});

export const {
  setTasksLists,
  setTasks,
  setStarredTasks,
  addStarredTask,
  removeStarredTask,
  setTaskStarred,
  setSelectedListIds,
  setFilters,
} = taskSlice.actions;
export default taskSlice.reducer;
