import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Sidebar from "../Sidebar/Sidebar";
import Modal from "../../../Components/Modal/Modal";
import { setTasksLists } from "../../../store/taskSlice";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [isCreatingList, setIsCreatingList] = useState(false);
  const { taskLists } = useSelector((state) => state.task);
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchTaskLists = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/get-tasklists`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        dispatch(setTasksLists(response.data.data));
      } catch (error) {
        console.error("Error fetching task lists:", error);
      }
    };

    fetchTaskLists();
  }, [accessToken, dispatch]);

  const createTaskList = async () => {
    const trimmedListName = listName.trim();
    if (!trimmedListName) return false;

    setIsCreatingList(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/create-list`,
        { listName: trimmedListName },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      dispatch(setTasksLists([...taskLists, response.data.data]));
      setListName("");
      return true;
    } catch (error) {
      console.error("Error creating task list:", error);
      return false;
    } finally {
      setIsCreatingList(false);
    }
  };

  const openCreateListModal = () => {
    setListName("");
    setIsListModalOpen(true);
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <IconButton
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        onClick={() => setIsSidebarOpen((previous) => !previous)}
        sx={{
          position: "fixed",
          top: 12,
          left: 12,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "background.paper",
          boxShadow: 1,
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <MenuIcon />
      </IconButton>

      <Sidebar isOpen={isSidebarOpen} onCreateList={openCreateListModal} />

      <Modal
        open={isListModalOpen}
        setOpen={setIsListModalOpen}
        text={listName}
        setText={setListName}
        handleSubmit={createTaskList}
        isSubmitting={isCreatingList}
      />

      <Box component="main" sx={{ p: 3, pt: 9 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Home;
