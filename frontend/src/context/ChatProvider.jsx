import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);

  return (
    <ChatContext.Provider
      value={{ selectedChat, setSelectedChat, chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};
