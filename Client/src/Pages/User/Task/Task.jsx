import React from "react";
import { CreateTask } from "./CreateTask";

export const Task = ({ selectedList }) => {
  console.log(selectedList);
  return (
    <div>
      <CreateTask selectedList={selectedList} />
    </div>
  );
};
