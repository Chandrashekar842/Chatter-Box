import React from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box } from '@mui/material'
import { SingleChat } from './SingleChat'

export const ChatBox = ({ fetch, setFetch }) => {

  const { selectedChat }  = ChatState()

  return (
    <Box
      sx={{
        display: {
          xs: selectedChat ? 'flex' : 'none',
          sm: 'flex',
          md: 'flex',
          lg: 'flex'
        },
        flexDirection: 'column',
        alignItems: 'center',
        width: {
          xs: '100%',
          sm: '60%',
          md: '60%',
          lg: '67%'
        },
        backgroundColor: "white",
        border: "5px solid #6495ED",
        borderRadius: "7px",
        padding: "5px",
        boxSizing: "border-box",
      }}
    >
       <SingleChat fetch={fetch} setFetch={setFetch} />
    </Box>
  )
}

