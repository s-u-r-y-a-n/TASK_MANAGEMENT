import React from "react";
import { useState, useEffect } from "react";
import Modal from "../../../Components/Modal/Modal";
import { useSelector, useDispatch } from "react-redux";
import { setTasksLists } from "../../../store/taskSlice.js";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const TaskList = () => {
  const [taskListName, setTaskListName] = useState("");
  const { taskLists } = useSelector((state) => state.task);
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");

  console.log("Task Lists from Redux Store:", taskLists);

  async function fetchTaskLists() {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-tasklists`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      dispatch(setTasksLists(response.data));
    } catch (error) {
      console.error("Error fetching task lists:", error);
    }
  }

  useEffect(() => {
    fetchTaskLists();
  }, []);

  async function createTaskList(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/create-list`,
        {
          listName: taskListName,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log("Task list created:", response.data);
    } catch (error) {
      console.error("Error creating task list:", error);
    }
  }

  return (
    <div>
      <Modal
        text={taskListName}
        setText={setTaskListName}
        handleSubmit={createTaskList}
      />
      <h1>{taskListName}</h1>
    </div>
  );
};
