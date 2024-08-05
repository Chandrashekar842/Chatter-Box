import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);

  // useEffect(() => {
  //     const userDetails = JSON.parse(localStorage.getItem('loggedInUser'))
  //     if(userDetails) {
  //         console.log(userDetails);
  //         setUser(userDetails)
  //     }
  // }, [])

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
