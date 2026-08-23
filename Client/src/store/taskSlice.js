import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  taskLists: [],
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTasksLists: (state, action) => {
      state.taskLists = action.payload;
    },
  },
});

export const { setTasksLists } = taskSlice.actions;
export default taskSlice.reducer;
