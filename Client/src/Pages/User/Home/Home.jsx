import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import Sidebar from "../Sidebar/Sidebar";
import useToast from "../../../hooks/useToast";
import Modal from "../../../Components/Modal/Modal";
import { setTasksLists } from "../../../store/taskSlice";
import { Task } from "../Task/Task";
import { Profile } from "../../Profile/Profile";
import Starred from "../../Starred/Starred";
import { Dashboard } from "@mui/icons-material";
import { Dashboard as DashboardComponent } from "../../Dashboard/Dashboard.jsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SIDEBAR_WIDTH = 4;

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [modalMode, setModalMode] = useState("create");
  const [selectedList, setSelectedList] = useState(null);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const { taskLists } = useSelector((state) => state.task);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const location = useLocation();
  const isStarredPage = location.pathname === "/starred";
  const isDashboardPage = location.pathname === "/dashboard";

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchTaskLists = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/get-tasklists`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
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
        {
          listName: trimmedListName,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      dispatch(setTasksLists([...taskLists, response.data.data]));
      showToast("success", "Created", response.data.message);
      setListName("");
      return true;
    } catch (error) {
      console.error("Error creating task list:", error);
      showToast(
        "error",
        "Failed",
        error.response?.data?.message ||
          "An error occurred while creating the list.",
      );
      return false;
    } finally {
      setIsCreatingList(false);
    }
  };

  const updateTaskList = async (listId, newListName) => {
    const trimmedListName = newListName.trim();
    if (!trimmedListName) return false;
    setIsCreatingList(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/update-list/${listId}`,
        {
          listName: trimmedListName,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const updatedTaskLists = taskLists.map((list) =>
        list._id === listId
          ? {
              ...list,
              listName: trimmedListName,
            }
          : list,
      );
      dispatch(setTasksLists(updatedTaskLists));
      showToast("success", "Updated", response.data.message);
      return true;
    } catch (error) {
      console.error("Error updating task list:", error);
      showToast(
        "error",
        "Failed",
        error.response?.data?.message ||
          "An error occurred while updating the list.",
      );
      return false;
    } finally {
      setIsCreatingList(false);
    }
  };

  const deleteTaskList = async (listId) => {
    setIsCreatingList(true);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/delete-list/${listId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const updatedTaskLists = taskLists.filter((list) => list._id !== listId);
      dispatch(setTasksLists(updatedTaskLists));
      if (selectedList?._id === listId) {
        setSelectedList(null);
      }
      showToast("success", "Deleted", response.data.message);
      return true;
    } catch (error) {
      console.error("Error deleting task list:", error);
      showToast(
        "error",
        "Failed",
        error.response?.data?.message ||
          "An error occurred while deleting the list.",
      );
      return false;
    } finally {
      setIsCreatingList(false);
    }
  };

  const openCreateListModal = () => {
    setModalMode("create");
    setSelectedList(null);
    setListName("");
    setIsListModalOpen(true);
  };

  const openEditListModal = (list) => {
    setModalMode("edit");
    setSelectedList(list);
    setListName(list?.listName || "");
    setIsListModalOpen(true);
  };

  const openDeleteListModal = (list) => {
    setModalMode("delete");
    setSelectedList(list);
    setListName(list?.listName || "");
    setIsListModalOpen(true);
  };

  const handleListAction = () => {
    if (modalMode === "create") {
      return createTaskList();
    }
    if (modalMode === "edit") {
      return updateTaskList(selectedList?._id, listName);
    }
    if (modalMode === "delete") {
      return deleteTaskList(selectedList?._id);
    }
    return false;
  };

  return (
    <>
      <Profile />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          width: "100%",
          bgcolor: "#ffffff",
        }}
      >
        <IconButton
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          onClick={() => setIsSidebarOpen((previous) => !previous)}
          sx={{
            position: "fixed",
            top: 12,
            left: 12,
            zIndex: (theme) => theme.zIndex.drawer + 2,
            bgcolor: "background.paper",
            boxShadow: 1,
            border: "1px solid #e0e2e6",
            "&:hover": {
              bgcolor: "#f1f3f4",
            },
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onCreateList={openCreateListModal}
          onEditList={openEditListModal}
          onDeleteList={openDeleteListModal}
          setSelectedList={setSelectedList}
          selectedListId={selectedList?._id || selectedList?.id}
        />

        <Modal
          open={isListModalOpen}
          setOpen={setIsListModalOpen}
          text={listName}
          setText={setListName}
          handleSubmit={handleListAction}
          isSubmitting={isCreatingList}
          modalMode={modalMode}
        />

        <Box
          component="main"
          sx={{
            minHeight: "100vh",
            boxSizing: "border-box",
            width: isSidebarOpen ? `calc(100% - ${SIDEBAR_WIDTH}px)` : "100%",
            marginLeft: isSidebarOpen ? `${SIDEBAR_WIDTH}px` : "0px",
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },
            pt: {
              xs: 8,
              sm: 9,
            },
            transition: "width 0.3s ease, margin-left 0.3s ease",
          }}
        >
          {isStarredPage ? (
            <Starred />
          ) : isDashboardPage ? (
            <DashboardComponent />
          ) : (
            <Task selectedList={selectedList} />
          )}
        </Box>
      </Box>
    </>
  );
};

export default Home;
