import React from "react";
import { CreateTask } from "./CreateTask.jsx";
import { FetchTasks } from "./FetchTasks.jsx";

export const Task = ({ selectedList }) => {
  console.log(selectedList);
  return (
    <div>
      <FetchTasks selectedList={selectedList} />
      <CreateTask selectedList={selectedList} />
    </div>
  );
};
