import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Modal,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { UsersDisplay } from "./UsersDisplay";

export const GroupEditModal = ({ children, fetch, setFetch , fetchMessages}) => {
  const { selectedChat, setSelectedChat } = ChatState();

  const token = localStorage.getItem("chatterBoxToken");
  const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const [openToast, setOpenToast] = useState(false);
  const [toastContent, setToastContent] = useState("");
  const timeoutRef = useRef(null);

  const handleCloseToast = (event, reason) => {
    if (reason == "clickaway") {
      return;
    }
    setOpenToast(false);
    setToastContent("");
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "#E3F2FD",
    border: "2px solid #000",
    borderRadius: "7px",
    boxShadow: 24,
    p: 2,
  };

  const renameGroup = async (chatId, chatName) => {
    if (chatName.trim() === "") {
      setToastContent("enter group name");
      setOpenToast(true);
      return;
    }
    try {
      setRenameLoading(true);
      const { data } = await axios.put(
        `http://localhost:8000/chat/group-rename`,
        {
          chatId: selectedChat._id,
          chatName: chatName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data) {
        setSelectedChat(data.chat);
        setRenameLoading(false);
        setFetch(!fetch);
      }
    } catch (error) {
      setToastContent("can't update name! try after some time");
      setOpenToast(true);
    }
  };

  const handleSearch = (query) => {
    setSearch(query);
    if (!query) {
      setSearchResults([]);
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `http://localhost:8000/user?search=${search}`,
          {
            headers: {
              Authorization: `Beaeer ${token}`,
            },
          }
        );
        if (data) {
          const filteredResults = data.users.filter(
            (user) =>
              !selectedChat.users.some((selected) => selected._id === user._id)
          );
          setSearchResults(filteredResults);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setToastContent("Error fetching search results");
        setOpenToast(true);
      } finally {
        setLoading(false);
        setGroupChatName("");
      }
    }, 1000);
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      setToastContent("User already added");
      setOpenToast(true);
      return;
    }

    if (selectedChat.groupAdmin._id !== loggedUser._id) {
      setToastContent("Only Admin can add users");
      setOpenToast(true);
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.put(
        `http://localhost:8000/chat/add-to-group`,
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data) {
        setSelectedChat(data.chat)
        setFetch(!fetch);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setToastContent("Unnable to add user");
      setOpenToast(true);
    }
  };

  const removeUser = async (userToRemove) => {
    if(selectedChat.groupAdmin._id !== loggedUser._id && userToRemove._id !== loggedUser._id ) {
      setToastContent('Operation restricted to Group Admins only')
      setOpenToast(true)
      return 
    }
    try {
      setLoading(true) 

      const { data } = await axios.put(`http://localhost:8000/chat/remove-user`, {
        chatId: selectedChat._id,
        userId: userToRemove._id
      },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if(data) {
        loggedUser._id === userToRemove._id ? setSelectedChat() : setSelectedChat(data.chat)
        fetchMessages()
        setFetch(!fetch)
        setLoading(false)
      }
    } catch (error) {
      setToastContent('unnable to remove user')
      setOpenToast(true)
    }
    setLoading(false)
  };

  return (
    <>
      <span onClick={handleOpen}>{children}</span>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
      >
        <Box
          width={{
            xs: 300,
            md: 400,
            lg: 400,
          }}
          sx={{ position: "relative", ...style }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{
              textAlign: "center",
              paddingBottom: 1,
            }}
          >
            {selectedChat.chatName}
            <span
              style={{
                position: "absolute",
                top: 2,
                right: 2,
                cursor: "pointer",
              }}
              onClick={() => handleClose()}
            >
              <CloseIcon />
            </span>
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              justifyContent: "center",
              width: "90%",
              margin: "auto",
            }}
          >
            <Stack
              direction="row"
              gap={1}
              display="flex"
              flexWrap="wrap"
              width="90%"
            >
              {selectedChat.users.map((user) => (
                <Chip
                  key={user._id}
                  label={user.name}
                  color="primary"
                  onDelete={() => removeUser(user)}
                  size="small"
                />
              ))}
            </Stack>
            <Box sx={{ display: "flex", gap: "5px" }}>
              <TextField
                placeholder="enter new group name"
                variant="outlined"
                size="small"
                onChange={(e) => setGroupChatName(e.target.value)}
                sx={{ width: "90%", margin: "auto" }}
              />
              <Button
                variant="contained"
                size="small"
                color="primary"
                disabled={renameLoading}
                onClick={() => renameGroup(selectedChat._id, groupChatName)}
              >
                {renameLoading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                  >
                    <CircularProgress size={20} />
                  </Box>
                ) : (
                  "Update"
                )}
              </Button>
            </Box>
            <TextField
              placeholder="add users"
              size="small"
              sx={{ width: "100%", margin: "auto" }}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {loading ? (
              <Box paddingTop="20px" textAlign="center" width="100%">
                <CircularProgress color="inherit" />
              </Box>
            ) : (
              <UsersDisplay
                users={searchResults}
                handleClick={handleAddUser}
                groupChat={true}
              />
            )}
          </Box>
          <Box sx={{ width: "100%", textAlign: "right" }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => removeUser(loggedUser)}
              sx={{
                width: "30%",
                fontSize: {
                  xs: "12px",
                  md: "15px",
                  lg: "15px",
                },
                fontFamily: "monospace",
                textTransform: "capitalize",
                p: "4px",
              }}
            >
              Leave group
            </Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {toastContent}
        </Alert>
      </Snackbar>
    </>
  );
};
