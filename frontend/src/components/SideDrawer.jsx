import React, { useEffect, useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CircleNotificationsSharpIcon from "@mui/icons-material/CircleNotificationsSharp";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { ChatState } from "../context/ChatProvider";
import { ReusableModal } from "./Profile";
import { AvatarDisplay } from "./AvatarDisplay";
import { UsersDisplay } from "./UsersDisplay";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

export const SideDrawer = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { setSelectedChat, chats, setChats, notification, setNotification } =
    ChatState();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const [anchorEl1, setAnchorEl1] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const handleModalOpen = () => {
    setOpenModal(true);
    handleCloseMenu2();
  };
  const handleModalClose = () => setOpenModal(false);

  const handleClickMenu1 = (event) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleCloseMenu1 = () => {
    setAnchorEl1(null);
  };

  const handleClickMenu2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleCloseMenu2 = () => {
    setAnchorEl2(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("chatterBoxToken");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const avatarStyle = {
    fontSize: "18px",
  };

  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = (newopen) => {
    setOpenDrawer(newopen);
  };

  const token = localStorage.getItem("chatterBoxToken");
  const [openToast, setOpenToast] = useState(false);
  const [toastContent, setToastContent] = useState("");

  const handleSearch = async () => {
    if (!search) {
      setToastContent("Enter user to search");
      setOpenToast(true);
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8000/user?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data) {
        setLoading(false);
        setSearchResult(data.users);
      }
    } catch (error) {
      setToastContent("Error fetching the user");
      setOpenToast(true);
    }
  };

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenToast(false);
    setToastContent("");
  };

  const accessChat = async (user) => {
    const userId = user._id;
    try {
      setLoadingChat(true);
      const { data } = await axios.post(
        "http://localhost:8000/chat",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data) {
        if (!chats.find((chat) => chat._id === data._id)) {
          setChats([data, ...chats]);
        }
        setLoadingChat(false);
        setSelectedChat(data);
        toggleDrawer(false);
      }
    } catch (err) {
      setToastContent("Error fetchng the chat!");
      console.log(err);

      setOpenToast(true);
    }
  };

  const getSender = (loggedInUser, chat) => {
    if (chat.users) {
      return chat.users[0]._id === loggedInUser._id
        ? chat.users[1].name
        : chat.users[0].name;
    }
  };

  return (
    <Box
      className="navbar"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      backgroundColor="#FFFAF0"
      width="100%"
      padding="7px 10px 7px 10px"
      boxSizing="border-box"
    >
      <Tooltip title="Search users to chat" arrow placement="bottom">
        <Typography
          onClick={() => toggleDrawer(true)}
          size="small"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          <SearchRoundedIcon fontSize="large" />
          <Typography
            sx={{
              display: {
                xs: "none", // hide on extra-small screens
                sm: "none", // hide on small screens
                md: "block", // hide on medium screens
                lg: "block", // show on large screens
                xl: "block", // show on extra-large screens
              },
            }}
          >
            Search User
          </Typography>
        </Typography>
      </Tooltip>
      <Typography
        className="app-name"
        sx={{
          fontFamily: "monospace",
          fontWeight: 400,
          fontSize: { xs: "18px", sm: "24px", md: "30px" },
        }}
      >
        Chatter Box
      </Typography>
      <div>
        <Button
          sx={{ padding: "1px" }}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClickMenu1}
        >
          <Badge badgeContent={notification.length} color="error" overlap="circular">
            <CircleNotificationsSharpIcon
              sx={{ fontSize: "2.75rem", color: "black" }}
            />
          </Badge>
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl1}
          open={Boolean(anchorEl1)}
          onClose={handleCloseMenu1}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          {!notification.length && <MenuItem>No new Messages</MenuItem>}
          {notification.map((notif) => (
            <MenuItem
              key="notif._id"
              onClick={() => {
                setSelectedChat(notif.chat);
                setNotification(notification.filter((n) => n !== notif));
                handleCloseMenu1();
              }}
            >
              {notif.chat.isGroupChat
                ? `new message from ${notif.chat.chatName}`
                : `new message from ${getSender(user, notif.chat)}`}
            </MenuItem>
          ))}
        </Menu>

        <Button
          sx={{ padding: "1px" }}
          aria-controls="simple-logout"
          aria-haspopup="true"
          onClick={handleClickMenu2}
          anchororigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformorigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <AvatarDisplay name={user.name} style={avatarStyle} />
          <ExpandMoreRoundedIcon sx={{ fontSize: "30px", color: "black" }} />
        </Button>
        <Menu
          id="simple-logout"
          anchorEl={anchorEl2}
          open={Boolean(anchorEl2)}
          onClose={handleCloseMenu2}
        >
          <MenuItem onClick={handleModalOpen}>My account</MenuItem>
          <Divider />
          <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
        </Menu>
        <ReusableModal
          open={openModal}
          onClose={handleModalClose}
          title={user.name}
          user={user}
          actions={
            <Button onClick={handleModalClose} variant="outlined">
              Close
            </Button>
          }
        />
        <Drawer open={openDrawer} onClose={() => toggleDrawer(false)}>
          <Box
            sx={{
              width: "330px",
              backgroundColor: "white",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "white",
                paddingBottom: "20px",
              }}
            >
              <Typography sx={{ textAlign: "center", margin: "15px" }}>
                Search user by name or email
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  marginTop: "3px",
                }}
              >
                <TextField
                  label="Search"
                  variant="outlined"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{
                    width: "65%",
                    borderRadius: "7px",
                  }}
                />
                <Button variant="contained" onClick={handleSearch}>
                  Go
                </Button>
              </Box>
            </Box>
            {loading ? (
              <Box paddingTop="30px" textAlign="center" width="100%">
                <CircularProgress color="inherit" />
              </Box>
            ) : (
              <Box padding="5px">
                <UsersDisplay
                  users={searchResult}
                  handleClick={accessChat}
                  groupChat={false}
                />
              </Box>
            )}
            {loadingChat && (
              <Box paddingTop="30px" textAlign="center" width="100%">
                <CircularProgress color="inherit" />
              </Box>
            )}
          </Box>
        </Drawer>
        <Snackbar
          open={openToast}
          autoHideDuration={3000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <Alert
            onClose={handleCloseToast}
            severity="warning"
            sx={{ width: "100%" }}
          >
            {toastContent}
          </Alert>
        </Snackbar>
      </div>
    </Box>
  );
};
