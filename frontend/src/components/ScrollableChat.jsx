import { Avatar, Tooltip } from "@mui/material";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { AvatarDisplay } from "./AvatarDisplay";

export const ScrollableChat = ({ messages }) => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const isSameSender = (messages, m, i, userId) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
  };

  const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
  };

  const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };

  const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(i === messages.length - 1);

    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;
    else return "auto";
  };
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip title={m.sender.name} arrow placement="bottom">
                <AvatarDisplay name={m.sender.name} style={{ width: 35, height: 35, marginRight: 1 }}  />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9FDD0"
                }`,
                borderRadius: "20px",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                padding: "5px 15px",
                maxWidth: "65%",
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap'
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};
