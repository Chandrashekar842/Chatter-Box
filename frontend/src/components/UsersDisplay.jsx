import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Box,
} from "@mui/material";

import { AvatarDisplay } from "./AvatarDisplay";

export const UsersDisplay = ({ users, accessChat }) => {
  const avatarStyle = {
    fontSize: "20px",
  };

  return (
    <Box sx={{ flexGrow: 1, overflowY: "auto", width: "90%", margin: "auto" }}>
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
            onClick={() => accessChat(user._id)}
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
                variant: 'body1', // Smaller primary text
                noWrap: true, // Prevent text wrapping
              }}
              secondaryTypographyProps={{
                variant: 'caption', // Even smaller secondary text
                noWrap: true, // Prevent text wrapping
              }}
              sx={{ // Prevents text wrapping
                overflow: "hidden",
                textOverflow: "ellipsis",
                margin: 0
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
