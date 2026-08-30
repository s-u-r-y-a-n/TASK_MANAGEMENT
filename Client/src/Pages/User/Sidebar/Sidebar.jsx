import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListSubheader,
  Toolbar,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { TaskList } from "../Task/TaskList";

const drawerWidth = 300;

const Sidebar = ({
  isOpen,
  onEditList,
  onDeleteList,
  onCreateList,
  setSelectedList,
}) => {
  const theme = useTheme();
  const { taskLists } = useSelector((state) => state.task);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isOpen ? drawerWidth : 0,
        flexShrink: 0,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        "& .MuiDrawer-paper": {
          width: isOpen ? drawerWidth : 0,
          overflowX: "hidden",
          borderRight: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <Toolbar />

      <Box sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
        <List
          subheader={
            <ListSubheader
              component="div"
              sx={{
                bgcolor: "transparent",
                fontWeight: 600,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: 1.1,
                color: "text.secondary",
                px: 3,
                py: 0.5,
              }}
            >
              Lists
            </ListSubheader>
          }
        >
          <TaskList
            taskLists={taskLists}
            isSidebarOpen={isOpen}
            onEditList={onEditList}
            onDeleteList={onDeleteList}
            setSelectedList={setSelectedList}
          />
        </List>
      </Box>

      <Divider />

      <Box sx={{ p: 1.5 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={onCreateList}
          startIcon={<AddIcon />}
          fullWidth
          sx={{
            justifyContent: "flex-start",
            px: 2,
            py: 1,
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            borderStyle: "dashed",
          }}
        >
          Create new List
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
