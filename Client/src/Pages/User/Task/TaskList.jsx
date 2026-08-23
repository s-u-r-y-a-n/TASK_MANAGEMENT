import {
  Box,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
} from "@mui/material";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export const TaskList = ({
  taskLists,
  isSidebarOpen,
  onEditList,
  onDeleteList,
}) => {
  if (taskLists?.length === 0) {
    return (
      <ListItem sx={{ px: 2.5, py: 1.5 }}>
        <ListItemText
          primary="No lists yet"
          secondary="Create a list to get started"
          primaryTypographyProps={{
            fontSize: "0.875rem",
            color: "text.secondary",
          }}
          secondaryTypographyProps={{ fontSize: "0.75rem" }}
        />
      </ListItem>
    );
  }

  return taskLists?.map((list) => {
    const listName = typeof list === "string" ? list : list.listName;
    const listId = typeof list === "string" ? list : list._id;

    return (
      <ListItem
        key={listId}
        disablePadding
        sx={{
          display: "block",
          "&:hover .list-actions": { opacity: isSidebarOpen ? 1 : 0 },
        }}
        secondaryAction={
          isSidebarOpen && (
            <Box
              className="list-actions"
              sx={{
                opacity: 0,
                transition: "opacity 0.2s ease-in-out",
                display: "flex",
                gap: 0.5,
                pr: 1,
              }}
            >
              <Tooltip title="Edit list">
                <IconButton
                  edge="end"
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    onEditList?.(list);
                  }}
                >
                  <ModeEditOutlineOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete list">
                <IconButton
                  edge="end"
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDeleteList?.(list);
                  }}
                  sx={{ "&:hover": { color: "error.main" } }}
                >
                  <DeleteOutlineOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )
        }
      >
        <ListItemButton
          sx={{
            minHeight: 48,
            px: 2.5,
            borderRadius: 1,
            mx: 1,
            mb: 0.5,
            "&:hover": { backgroundColor: "action.hover" },
          }}
        >
          <ListItemText
            primary={listName}
            primaryTypographyProps={{
              fontSize: "0.875rem",
              fontWeight: 500,
              noWrap: true,
            }}
          />
        </ListItemButton>
      </ListItem>
    );
  });
};
