import { useState } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import "./styles/TaskList.scss";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedListIds } from "../../../store/taskSlice.js";

export const TaskList = ({
  taskLists = [],
  onEditList,
  onDeleteList,
  setSelectedList,
  selectedListId,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const { selectedListIds } = useSelector((state) => state.task);
  const dispatch = useDispatch();

  const handleMenuOpen = (event, id) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setActiveMenuId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveMenuId(null);
  };

  console.log("SELECTED LIST IDS:", selectedListIds);

  const handleCheckboxChange = (event, checked) => {
    console.log("CHECKBOX CHANGED");
    console.log(checked);
    console.log(event.target.value);
    const listId = event.target.value;
    if (checked) {
      dispatch(setSelectedListIds([...selectedListIds, listId]));
    } else {
      dispatch(
        setSelectedListIds(selectedListIds.filter((id) => id !== listId)),
      );
    }
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
            <Checkbox
              checked={selectedListIds.includes(id)}
              onChange={(event, checked) => {
                setSelectedList(list);
                handleCheckboxChange(event, checked);
              }}
              value={id}
            />
            <ListItemButton
              className={`task-list-button ${
                selectedListIds.includes(id) ? "checked" : ""
              }`}
            >
              <ListItemText
                primary={
                  list.listName || list.name || list.title || "Unnamed List"
                }
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
