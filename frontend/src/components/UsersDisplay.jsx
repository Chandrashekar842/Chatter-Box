import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Box,
} from "@mui/material";
import "../App.css";

import { AvatarDisplay } from "./AvatarDisplay";

export const UsersDisplay = ({ users, handleClick, groupChat }) => {
  const avatarStyle = {
    fontSize: "20px",
  };

  const sideDrawerStyles = {
    flexGrow: 1,
    overflowY: "auto",
    width: "90%",
    margin: "auto",
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        width: "90%",
        margin: "auto",
        maxHeight: groupChat === true ? 200 : 800,
        scrollbarWidth: "thin", // For Firefox
        "&::-webkit-scrollbar": {
          width: "8px", // For WebKit browsers
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#f1f1f1",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#888",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#555",
        },
      }}
    >
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "0.5rem",
        }}
      >
        {users.map((user) => (
          <ListItem
            onClick={() => handleClick(user)}
            key={user._id}
            sx={{
              backgroundColor: "#ADD8E6",
              borderRadius: "7px",
              cursor: "pointer",
              ":hover": { backgroundColor: "#B0E0E6" },
            }}
          >
            <ListItemAvatar>
              <AvatarDisplay name={user.name} style={avatarStyle} />
            </ListItemAvatar>
            <ListItemText
              primary={user.name}
              secondary={`Email: ${user.email}`}
              primaryTypographyProps={{
                variant: "body1", // Smaller primary text
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
                margin: 0,
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
