import React from "react";
import { useState } from "react";
import Modal from "../../../Components/Modal/Modal";

export const TaskList = () => {
  const [taskList, setTaskList] = useState("");

  return (
    <div>
      <Modal text={taskList} setText={setTaskList} />
      <h1>{taskList}</h1>
    </div>
  );
};
