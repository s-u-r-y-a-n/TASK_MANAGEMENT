import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { TaskList } from "../Task/TaskList";
import "./styles/Sidebar.scss";
import { CreateTask } from "../Task/CreateTask";

const drawerWidth = 260;

const Sidebar = ({
  isOpen,
  onClose,
  onEditList,
  onDeleteList,
  onCreateList,
  setSelectedList,
  selectedListId,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { taskLists } = useSelector((state) => state.task);
  const location = useLocation();
  const navigate = useNavigate();

  const openStarredTasks = () => {
    navigate("/starred");
    if (isMobile) onClose();
  };

  const openDashboard = () => {
    navigate("/dashboard");
    if (isMobile) onClose();
  };

  const selectTaskList = (list) => {
    setSelectedList(list);
    if (location.pathname !== "/home") navigate("/home");
    if (isMobile) onClose();
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: isMobile ? 0 : isOpen ? drawerWidth : 0,
        flexShrink: 0,
        transition: !isMobile
          ? theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            })
          : "none",
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#f8fafd",
          borderRight: "1px solid #e0e2e6",
          ...(!isMobile && {
            width: isOpen ? drawerWidth : 0,
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        },
      }}
    >
      <Toolbar />

      <Box className="sidebar-scrollable-content">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            mb: 2,
          }}
        >
          <CreateTask />
        </Box>
        <List className="sidebar-primary-navigation">
          <ListItemButton
            selected={location.pathname === "/starred"}
            onClick={openStarredTasks}
            className="sidebar-starred-button"
          >
            <ListItemIcon>
              <StarBorderOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Starred" />
          </ListItemButton>
        </List>
        <List className="sidebar-primary-navigation">
          <ListItemButton
            selected={location.pathname === "/dashboard"}
            onClick={openDashboard}
            className="sidebar-dashboard-button"
          >
            <ListItemIcon>
              <SpaceDashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </List>

        <List
          subheader={
            <ListSubheader component="div" className="sidebar-list-subheader">
              My Lists
            </ListSubheader>
          }
        >
          <TaskList
            taskLists={taskLists}
            isSidebarOpen={isOpen}
            onEditList={onEditList}
            onDeleteList={onDeleteList}
            setSelectedList={selectTaskList}
            selectedListId={selectedListId}
          />
        </List>
      </Box>

      <Divider className="sidebar-divider" />

      <Box className="sidebar-action-container">
        <Button
          variant="outlined"
          onClick={onCreateList}
          startIcon={<AddIcon />}
          fullWidth
          className="create-list-button"
        >
          Create new List
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
