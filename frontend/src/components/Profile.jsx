import React from "react";
import { Modal, Box, Button, Typography } from "@mui/material";
import { AvatarDisplay } from "./AvatarDisplay";

export const ReusableModal = ({ open, onClose, title, user, actions }) => {

    const avatarStyle = {
        width: "100px",
    height: "100px",
    fontSize: "30px",
    textTransform: "uppercase",
    }

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "#E3F2FD",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "7px",
        }}
      >
        <h2 id="modal-title">{title}</h2>
        <AvatarDisplay name={user.name} style={avatarStyle}/>
        <br />
        <Typography variant="h5">Email: {user.email}</Typography>
        <Box mt={2}>
          {actions ? (
            actions
          ) : (
            <Button onClick={onClose} variant="contained">
              Close
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};
