import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  taskLists: [],
  tasks: [],
  selectedListIds: [],
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
    setSelectedListIds: (state, action) => {
      state.selectedListIds = action.payload;
    },
  },
});

export const { setTasksLists, setTasks, setSelectedListIds } = taskSlice.actions;
export default taskSlice.reducer;
