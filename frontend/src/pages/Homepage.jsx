import React, { useEffect } from 'react'

import { ChatState } from '../context/ChatProvider'
import { Box } from '@mui/material'
import {SideDrawer} from '../components/SideDrawer'
import { MyChats } from '../components/MyChats'
import { ChatBox } from '../components/ChatBox'

export const Homepage = () => {
  // const { user } = ChatState()

  const user = JSON.parse(localStorage.getItem('loggedInUser'))

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        width="100%"
        justifyContent="space-between"
        height= "91.5vh"
        sx={{ padding: "10px", boxSizing: "border-box"}}
        >
        {user && <MyChats />}
        {user && <ChatBox/>}
      </Box>
    </div>
  )
}
