import React, { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { ReusableModal } from "./Profile";
import { GroupChatModal } from "./GroupChatModal";
import { GroupEditModal } from "./GroupEditModal";

export const SingleChat = ({ fetch, setFetch }) => {
  const { selectedChat, setSelectedChat } = ChatState();
  const [openModal, setOpenModal] = useState(false);
  const handleModalOpen = () => {
    setOpenModal(true);
  };
  const handleModalClose = () => setOpenModal(false);

  const user = JSON.parse(localStorage.getItem("loggedInUser"));

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
                padding: "5px",
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
                <GroupEditModal fetch={fetch} setFetch={setFetch}>
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
          <Box width="100%" height="100%" backgroundColor="#F0F8FF"></Box>
        </>
      )}
    </>
  );
};
