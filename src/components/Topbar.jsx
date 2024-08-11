import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Logout, People, Article, AccountCircle } from "@mui/icons-material";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import ThumbUp from "@mui/icons-material/ThumbUp";
import Bookmark from "@mui/icons-material/Bookmark";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
    position: "relative",
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

export default function PersistentDrawerRight(prop) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // <-- useLocation hook to get current path
  const user = useSelector((state) => state.User);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logout Successfully");
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/about");
  };

  const handleLike = () => {
    navigate("/like");
  };

  const handleSave = () => {
    navigate("/save");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <Typography
            variant="h4"
            noWrap
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => {
              navigate("/");
            }}
            component="div"
          >
            The Blog App
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerOpen}
            sx={{ ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Main open={open}>
        <DrawerHeader />
        {prop.children}
      </Main>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {user?.isAdmin && (
          <List>
            <ListItem
              disablePadding
              onClick={() => {
                navigate("/users");
              }}
              selected={location.pathname === "/users"}
            >
              <ListItemButton>
                <ListItemIcon>
                  <People sx={{ color: "blue" }} />
                </ListItemIcon>
                <ListItemText primary={"Users"} />
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              onClick={() => {
                navigate("/blogs");
              }}
              selected={location.pathname === "/blogs"}
            >
              <ListItemButton>
                <ListItemIcon>
                  <Article sx={{ color: "green" }} />
                </ListItemIcon>
                <ListItemText primary={"Blogs"} />
              </ListItemButton>
            </ListItem>
          </List>
        )}
        <List>
          <ListItem
            disablePadding
            onClick={handleProfile}
            selected={location.pathname === "/about"}
          >
            <ListItemButton>
              <ListItemIcon>
                <AccountCircle sx={{ color: "purple" }} />
              </ListItemIcon>
              <ListItemText primary={"Profile"} />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        {!user?.isAdmin && (
          <List>
            <ListItem
              disablePadding
              onClick={handleLike}
              selected={location.pathname === "/like"}
            >
              <ListItemButton>
                <ListItemIcon>
                  <ThumbUp sx={{ color: "#ed4956" }} />
                </ListItemIcon>
                <ListItemText primary={"Like"} />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem
              disablePadding
              onClick={handleSave}
              selected={location.pathname === "/save"}
            >
              <ListItemButton>
                <ListItemIcon>
                  <Bookmark sx={{ color: "black" }} />
                </ListItemIcon>
                <ListItemText primary={"Save"} />
              </ListItemButton>
            </ListItem>
          </List>
        )}
        <Divider />
        <List>
          <ListItem disablePadding onClick={handleLogout}>
            <ListItemButton>
              <ListItemIcon>
                <Logout sx={{ color: "red" }} />
              </ListItemIcon>
              <ListItemText primary={"Logout"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
