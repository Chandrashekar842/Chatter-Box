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
import React, { useState, useRef } from "react";
import { ChatState } from "../context/ChatProvider";
import { UsersDisplay } from "./UsersDisplay";
import axios from "axios";

export const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  const { chats, setChats } = ChatState();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const token = localStorage.getItem("chatterBoxToken");

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openToast, setOpenToast] = useState(false);
  const [toastContent, setToastContent] = useState("")

  const handleCloseToast = (event, reason) => {
    if (reason == "clickaway") {
      return;
    }
    setOpenToast(false);
    setToastContent('')
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

  const handleSearch = (query) => {
    setSearch(query);
    if (!query) {
      setSearchResults([])
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
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data) {
          const filteredResults = data.users.filter(
            (user) => !selectedUsers.some(selected => selected._id === user._id)
          );
          setSearchResults(filteredResults);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setToastContent('Error fetching search results')
        setOpenToast(true)
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const handleSubmit = async () => {
    if(!groupChatName) {
      setToastContent('Enter group name!')
      setOpenToast(true)
      return
    }
    if(selectedUsers.length < 2) {
      setToastContent('Group should contain more than 2 members!')
      setOpenToast(true)
      return
    }
    try {
      const { data } = await axios.post(`http://localhost:8000/chat/group`, {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id))
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(data) {
        setChats([data.group, ...chats])
        handleClose()
      }
    } catch(err) {
      console.log(err)
      setToastContent('Unnable to create group, try after some time')
      setOpenToast(true)
    }
  };

  const handleGroup = (user) => {
    if(selectedUsers.includes(user)) {
      console.log("user already exists");
      return
    } else {
      setSelectedUsers([...selectedUsers, user])
      const updatedList = searchResults.filter((searchResult) => searchResult._id !== user._id)
      setSearchResults(updatedList)
    }
  }

  const removeChip = (userToRemove) => {
    setSelectedUsers(selectedUsers.filter(user => user !== userToRemove))
    setSearchResults([userToRemove, ...searchResults])
  }

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
          sx={style}
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
            Create Group Chat
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              justifyContent: "center",
            }}
          >
            <TextField
              placeholder="enter Group name"
              variant="outlined"
              size="small"
              onChange={(e) => setGroupChatName(e.target.value)}
              sx={{ width: "90%", margin: "auto" }}
            />
            <TextField
              placeholder="add users"
              size="small"
              sx={{ width: "90%", margin: "auto" }}
              onChange={(e) => handleSearch(e.target.value)}
            />
            { selectedUsers.length >0 && (
              <Stack direction="row" gap={1} display='flex' flexWrap='wrap' width='90%'>
                { selectedUsers.map(user => (
                  <Chip
                    key={user._id}
                    label={user.name}
                    onDelete={() => removeChip(user)}
                    color="primary"
                   />
                ))}
              </Stack>
            ) }
            {loading ? (
              <Box paddingTop="20px" textAlign="center" width="100%">
                <CircularProgress color="inherit" />
              </Box>
            ) : (
              <UsersDisplay users={searchResults} handleClick={handleGroup} groupChat={true}/>
            )}
            <Box sx={{ width: "100%", textAlign: "right" }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
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
                create chat
              </Button>
            </Box>
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
