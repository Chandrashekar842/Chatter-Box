import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import axios from 'axios'
import { Alert, Box, Button, CircularProgress, List, ListItem, ListItemText, Snackbar, Typography } from '@mui/material'

export const MyChats = () => {

  const [loggedInUser, setLoggedInUser] = useState('')
  const [openToast, setOpenToast] = useState(false)
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState()
  const user = JSON.parse(localStorage.getItem('loggedInUser'))
  
  const handleCloseToast = (event, reason) => {
    if(reason == 'clickaway') {
      return
    }
    setOpenToast(false)
  }
  
  const fetchChats = async () => {
    const token = localStorage.getItem('chatterBoxToken')
    try {
      const { data } = await axios.get('http://localhost:8000/chat', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(data) {
        setChats(data)
      }
    } catch(err) {
      setOpenToast(true)
    }
  }

  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem('loggedInUser')))
    fetchChats()
  }, [])

  const getSender = (loggedInUser, users) => {
    return users[0]._id === loggedInUser._id ? users[1].name : users[0].name
  }
  
  return (
    <Box
      sx={{
        display: {
          xs: selectedChat ? 'none' : 'flex',
          md: 'flex',
          ld: 'flex'
        },
        flexDirection: 'column',
        alignItems:'center',
        width: {
          xs: '100%',
          sm: '33%',
          md: '33%',
          lg: '33%'
        },
        backgroundColor: 'white',
        border: '5px solid #6495ED',
        borderRadius: '7px',
        padding: '5px',
        boxSizing: 'border-box'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding:'3px',
        }} 
      >
        <Typography
          sx={{
            fontSize: {
              xs: '16px',
              sm: '18px'
            },
            padding: '4px 7px'
          }}
        >
          My Chats</Typography>
        <Button
          sx={{
            color: '#000',
            padding: '10px',
            fontSize: {
              xs: '10px',
              md: '13px'
            }
          }}
        >new group chat +</Button>
      </Box>
      {chats ? (
        <List sx={{ 
          overflowY: 'scroll',
          width: '90%',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
          }}>
        {chats.map((chat) => (
          <ListItem 
            key={chat._id}
            onClick={() => setSelectedChat(chat)}
            sx={{
              padding: '10px 20px',
              cursor: 'pointer',
              backgroundColor: selectedChat === chat ? '#4682B4' : '#E6E6FA',
              color: selectedChat === chat ? 'white' : 'black',
              borderRadius: '10px'
            }}
          >
            <ListItemText 
              primary= {!chat.isGroupChat ? getSender(loggedInUser, chat.users) : chat.chatName}
              secondary='sample text'
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
      ) : (
        <CircularProgress />
      )}
      
      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity="warning"
          sx={{ width: "100%" }}
        >
          Error fetching the chats
        </Alert>
      </Snackbar>
    </Box>
  )
}

