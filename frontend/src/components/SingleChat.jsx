import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { ReusableModal } from "./Profile";
import { GroupChatModal } from "./GroupChatModal";
import { GroupEditModal } from "./GroupEditModal";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { ScrollableChat } from "./ScrollableChat";

export const SingleChat = ({ fetch, setFetch }) => {
  const { selectedChat, setSelectedChat } = ChatState();
  const [openModal, setOpenModal] = useState(false);
  const handleModalOpen = () => {
    setOpenModal(true);
  };
  const handleModalClose = () => setOpenModal(false);

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const token = localStorage.getItem("chatterBoxToken");

  const getSender = (loggedInUser, chat) => {
    if (chat.users) {
      return chat.users[0]._id === loggedInUser._id
        ? chat.users[1].name
        : chat.users[0].name;
    }
  };

  const getSenderFull = (loggedInUser, chat) => {
    if (chat.users) {
      return chat.users[0]._id === loggedInUser._id
        ? chat.users[1]
        : chat.users[0];
    }
  };

  const typeHandler = (e) => {
    setNewMessage(e.target.value);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage === "") {
      return;
    }
    try {
      const { data } = await axios.post(
        `http://localhost:8000/message`,
        {
          content: newMessage,
          chatId: selectedChat._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data) {
        setNewMessage("");
        setMessages([...messages, data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:8000/message/${selectedChat._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data) {
        console.log(data);
        setLoading(false);
        setMessages(data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  return (
    <>
      {!selectedChat ? (
        <Box
          width="100%"
          sx={{
            margin: "auto",
            textAlign: "center",
            fontFamily: "sans-serif",
            fontWeight: 500,
            fontSize: "25px",
          }}
        >
          Click on a user to start chatting
        </Box>
      ) : (
        <>
          <Typography
            sx={{
              fontSize: {
                xs: "25px",
                sm: "25px",
                md: "30px",
                lg: "30px",
              },
              width: "100%",
              display: "flex",
              justifyContent: {
                xs: "space-between",
                sm: "space-between",
              },
              padding: "5px",
              alignItems: "center",
            }}
          >
            <ArrowBackIcon
              fontSize="medium"
              onClick={() => setSelectedChat("")}
              sx={{
                display: {
                  xs: "flex",
                  sm: "none",
                  md: "none",
                },
                cursor: "pointer",
                backgroundColor: "#6495ED",
                borderRadius: "8px",
                padding: "5px"
              }}
            />
            {!selectedChat.isGroupChat ? (
              <>
                <Typography variant="h5" sx={{ paddingLeft: "10px" }}>
                  {getSender(user, selectedChat)}
                </Typography>
                <VisibilityRoundedIcon
                  fontSize="medium"
                  onClick={handleModalOpen}
                  sx={{
                    cursor: "pointer",
                    backgroundColor: "#6495ED",
                    borderRadius: "8px",
                    padding: "5px",
                  }}
                />
                <ReusableModal
                  open={openModal}
                  onClose={handleModalClose}
                  title={getSender(user, setSelectedChat)}
                  user={getSenderFull(user, selectedChat)}
                  actions={
                    <Button onClick={handleModalClose} variant="outlined">
                      Close
                    </Button>
                  }
                />
              </>
            ) : (
              <>
                <Typography variant="h5" sx={{ paddingLeft: "10px" }}>
                  {selectedChat.chatName}
                </Typography>
                <GroupEditModal
                  fetch={fetch}
                  setFetch={setFetch}
                  fetchMessages={fetchMessages}
                >
                  <VisibilityRoundedIcon
                    fontSize="medium"
                    sx={{
                      cursor: "pointer",
                      backgroundColor: "#6495ED",
                      borderRadius: "8px",
                      padding: "5px",
                    }}
                  />
                </GroupEditModal>
              </>
            )}
          </Typography>
          <Box
            sx={{
              display:'flex',
              flexDirection:'column',
              justifyContent:'flex-end',
              width: '100%',
              height: '100%',
              overflowY: 'hidden',
              boxSizing:'border-box'
            }}
          >
            {loading ? (
              <Box
                width={20}
                height={20}
                alignSelf='center'
                margin='auto'
              >
                <CircularProgress size={50} color="info" />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none"
                }}
              >
                <ScrollableChat messages={messages} />
              </Box>
            )}
            <Box
              marginBottom={0}
              width="100%"
              component="form"
              onSubmit={sendMessage}
              padding={1}
              boxSizing='border-box'
            >
              <TextField
                size="small"
                value={newMessage}
                onChange={typeHandler}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage(e);
                  }
                }}
                sx={{
                  width: "100%",
                }}
              />
            </Box>
          </Box>
        </>
      )}
    </>
  );
};
