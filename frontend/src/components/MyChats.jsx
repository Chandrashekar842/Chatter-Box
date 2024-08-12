import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Icon,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Typography,
} from "@mui/material";
import { ChatState } from "../context/ChatProvider";
import { GroupChatModal } from "./GroupChatModal";
import AddCircleIcon from "@mui/icons-material/Add";

export const MyChats = ({ setFetch, fetch }) => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [openToast, setOpenToast] = useState(false);
  const [toastContent, setToastContent] = useState("");
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const handleCloseToast = (event, reason) => {
    if (reason == "clickaway") {
      return;
    }
    setOpenToast(false);
    setToastContent("");
  };

  const fetchChats = async () => {
    const token = localStorage.getItem("chatterBoxToken");
    try {
      const { data } = await axios.get("http://localhost:8000/chat", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data) {
        setChats(data)
      }
    } catch (err) {
      setToastContent("Unnable to fetch the chats");
      setOpenToast(true);
    }
  };

  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("loggedInUser")));
    fetchChats();
  }, [fetch]);

  const getSender = (loggedInUser, chat) => {
    
    if (chat.users) {
      return chat.users[0]._id === loggedInUser._id
        ? chat.users[1].name
        : chat.users[0].name;
    }
  };

  return (
    <Box
      sx={{
        display: {
          xs: selectedChat ? "none" : "flex",
          sm: 'flex',
          md: "flex",
          ld: "flex",
        },
        flexDirection: "column",
        alignItems: "center",
        width: {
          xs: "100%",
          sm: "40%",
          md: "40%",
          lg: "33%",
        },
        backgroundColor: "white",
        border: "5px solid #6495ED",
        borderRadius: "7px",
        padding: "5px",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "3px",
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "16px",
              sm: "12px",
              md: "18px",
            },
            padding: "4px 7px",
          }}
        >
          My Chats
        </Typography>
        <GroupChatModal setFetch={setFetch} fetch={fetch}>
          <Button
            sx={{
              color: "#000",
              padding: "10px",
              fontSize: {
                xs: "12px",
                sm: "10px",
                md: "14px",
              },
            }}
          >
            <span style={{ fontWeight: "bolder" }}>Create Group </span>{" "}
            <AddCircleIcon sx={{ fontSize: "27px" }} />
          </Button>
        </GroupChatModal>
      </Box>
      {chats ? (
        <List
          sx={{
            overflowY: "scroll",
            width: "90%",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {chats.map((chat) => (
            <ListItem
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              sx={{
                padding: "10px 20px",
                cursor: "pointer",
                backgroundColor: selectedChat === chat ? "#4682B4" : "#E6E6FA",
                color: selectedChat === chat ? "white" : "black",
                borderRadius: "10px",
              }}
            >
              <ListItemText
                primary={
                  chat.isGroupChat
                    ? chat.chatName
                    : getSender(loggedInUser, chat)
                }
                secondary="sample text"
                primaryTypographyProps={{
                  variant: "body2", // Smaller primary text
                  noWrap: true, // Prevent text wrapping
                }}
                secondaryTypographyProps={{
                  variant: "caption", // Even smaller secondary text
                  noWrap: true, // Prevent text wrapping
                }}
                sx={{
                  // Prevents text wrapping
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  margin: 0
                }}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <CircularProgress />
      )}

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
    </Box>
  );
};
