import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Sidebar from "../Sidebar/Sidebar";
import useToast from "../../../hooks/useToast";
import Modal from "../../../Components/Modal/Modal";
import { setTasksLists } from "../../../store/taskSlice";
import { Task } from "../Task/Task";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [modalMode, setModalMode] = useState("create");
  const [selectedList, setSelectedList] = useState(null);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const { taskLists } = useSelector((state) => state.task);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const accessToken = localStorage.getItem("accessToken");

  console.log("SELECTED LIST", selectedList);

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
        { listName: trimmedListName },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      const updatedTaskLists = taskLists.map((list) =>
        list._id === listId ? { ...list, listName: trimmedListName } : list,
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
        { headers: { Authorization: `Bearer ${accessToken}` } },
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
    setListName(list.listName);
    setIsListModalOpen(true);
  };

  const openDeleteListModal = (list) => {
    setModalMode("delete");
    setSelectedList(list);
    setListName(list.listName);
    setIsListModalOpen(true);
  };

  const handleListAction = () => {
    if (modalMode === "create") return createTaskList();
    if (modalMode === "edit") return updateTaskList(selectedList._id, listName);
    if (modalMode === "delete") return deleteTaskList(selectedList._id);
    return false;
  };

  return (
    <Box sx={{ minHeight: "100vh", border: "5px solid red" }}>
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

      <Sidebar
        isOpen={isSidebarOpen}
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
        sx={{ p: 3, pt: 9 }}
        style={{ border: "2px solid green", minHeight: "100vh", width: "100%" }}
      >
        <Task selectedList={selectedList} />
      </Box>
    </Box>
  );
};

export default Home;
