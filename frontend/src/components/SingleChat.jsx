import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { ScrollableChat } from "./ScrollableChat";
import io from 'socket.io-client'
import Lottie from 'react-lottie'

import { ChatState } from "../context/ChatProvider";
import { ReusableModal } from "./Profile";
import { GroupChatModal } from "./GroupChatModal";
import { GroupEditModal } from "./GroupEditModal";
import animationData from '../data/Animation - 1723716879764.json'

const ENDPOINT = 'http://localhost:8000'
let socket, selectedChatCompare

export const SingleChat = ({ fetch, setFetch }) => {
  const { selectedChat, setSelectedChat } = ChatState();
  const [openModal, setOpenModal] = useState(false);
  const handleModalOpen = () => {
    setOpenModal(true);
  };
  const handleModalClose = () => setOpenModal(false);

  const [loading, setLoading] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false)
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const token = localStorage.getItem("chatterBoxToken");

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }

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

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit('setup', user)
    socket.on('connected', () => setSocketConnected(true ))
    socket.on('typing', () => setIsTyping(true))
    socket.on('stop typing', () => setIsTyping(false))
  }, [])

  const typeHandler = (e) => {
    setNewMessage(e.target.value);

    if(!socketConnected) return

    if(!typing) {
      setTyping(true)
      socket.emit('typing', selectedChat._id)
    }
    let lastTypingTime = new Date().getTime()
    let timerLength = 3000
    setTimeout(() => {
      let timeNow = new Date().getTime()
      let timeDiff = timeNow - lastTypingTime

      if(timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id)
        setTyping(false)
      } 
    }, timerLength);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage === "") {
      return;
    }
    socket.emit('stop typing', selectedChat._id)
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
        socket.emit('new message', data)
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
        setLoading(false);
        setMessages(data);
        socket.emit('join chat', selectedChat._id)
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat
  }, [selectedChat]);

  useEffect(() => {
    socket.on('message received',(newMessageReceived) => {
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        //notify the user
      } else {
        setMessages([...messages, newMessageReceived])
      }
    })
  })

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
              {isTyping ? <div>
                <Lottie 
                options={defaultOptions}
                width={70}
                style={{ marginBottom: 15, marginLeft: 0 }}
                />
              </div> : <></>}
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
