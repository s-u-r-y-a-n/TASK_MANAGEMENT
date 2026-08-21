import { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

const drawerWidth = 240;
const collapsedWidth = 70;

const menuItems = [
  {
    text: "Home",
    icon: <HomeIcon />,
  },
  {
    text: "Profile",
    icon: <PersonIcon />,
  },
  {
    text: "Settings",
    icon: <SettingsIcon />,
  },
];

const Sidebar = ({ lists = ["Name", "Surya","Surya"] }) => {
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        transition: "width 0.3s ease",

        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : collapsedWidth,
          overflowX: "hidden",
          transition: "width 0.3s ease",
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: open ? "space-between" : "center",
          alignItems: "center",
        }}
      >
        {open && (
          <Typography variant="h6" noWrap>
            Dashboard
          </Typography>
        )}

        <IconButton onClick={handleDrawerToggle}>
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.text}
                sx={{
                  opacity: open ? 1 : 0,
                  transition: "opacity 0.2s",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List
        subheader={
          <ListSubheader
            component="div"
            sx={{
              bgcolor: "transparent",
              opacity: open ? 1 : 0,
              transition: "opacity 0.2s",
            }}
          >
            Lists
          </ListSubheader>
        }
      >
        {lists.length > 0 ? (
          lists.map((list) => {
            const listName = typeof list === "string" ? list : list.listName;

            return (
              <ListItem key={typeof list === "string" ? list : list._id} disablePadding>
                <ListItemButton
                  sx={{
                    minHeight: 44,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <FormatListBulletedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={listName}
                    sx={{ opacity: open ? 1 : 0, transition: "opacity 0.2s" }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })
        ) : (
          <ListItem sx={{ px: 2.5, minHeight: 44 }}>
            <ListItemText
              primary="No lists yet"
              secondary="Create a list to see it here"
              sx={{ opacity: open ? 1 : 0, transition: "opacity 0.2s" }}
            />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
