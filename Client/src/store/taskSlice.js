import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  taskLists: [],
  tasks: [],
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
  },
});

export const { setTasksLists } = taskSlice.actions;
export default taskSlice.reducer;
