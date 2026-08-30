import { useState } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import "./TaskList.scss";

export const TaskList = ({
  taskLists = [],
  onEditList,
  onDeleteList,
  setSelectedList,
  selectedListId,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const handleMenuOpen = (event, id) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setActiveMenuId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveMenuId(null);
  };

  return (
    <div className="task-list-wrapper">
      {taskLists.map((list) => {
        const id = list._id || list.id;
        const isSelected = selectedListId === id;

        return (
          <ListItem
            key={id}
            disablePadding
            className="task-list-item-container"
          >
            <ListItemButton
              selected={isSelected}
              onClick={() => setSelectedList(list)}
              className={`task-list-button ${isSelected ? "selected" : ""}`}
            >
              <ListItemIcon className="task-list-icon">
                <ListAltIcon fontSize="small" />
              </ListItemIcon>

              <ListItemText
                primary={list.listName || list.name || list.title || "Unnamed List"}
                primaryTypographyProps={{
                  noWrap: true,
                  className: "task-list-name",
                }}
              />

              <IconButton
                size="small"
                onClick={(e) => handleMenuOpen(e, id)}
                className="task-list-actions-btn"
                aria-label="List options"
              >
                <MoreVertIcon fontSize="inherit" />
              </IconButton>
            </ListItemButton>
          </ListItem>
        );
      })}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        className="task-list-action-menu"
      >
        <MenuItem
          onClick={() => {
            const list = taskLists.find(
              (taskList) => (taskList._id || taskList.id) === activeMenuId,
            );
            if (list) onEditList(list);
            handleMenuClose();
          }}
        >
          <EditOutlinedIcon fontSize="small" className="menu-item-icon" />
          Edit name
        </MenuItem>
        <MenuItem
          onClick={() => {
            const list = taskLists.find(
              (taskList) => (taskList._id || taskList.id) === activeMenuId,
            );
            if (list) onDeleteList(list);
            handleMenuClose();
          }}
          className="danger-item"
        >
          <DeleteIcon fontSize="small" className="menu-item-icon" />
          Delete list
        </MenuItem>
      </Menu>
    </div>
  );
};

export default TaskList;
