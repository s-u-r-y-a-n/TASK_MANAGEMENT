import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListSubheader,
  Toolbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { TaskList } from "../Task/TaskList";
import "./styles/Sidebar.scss";

const drawerWidth = 290;

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

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: !isMobile && isOpen ? drawerWidth : 0,
        flexShrink: 0,
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
            setSelectedList={setSelectedList}
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
