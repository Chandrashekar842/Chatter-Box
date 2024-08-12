import React, { useEffect, useState } from 'react'

import { ChatState } from '../context/ChatProvider'
import { Box } from '@mui/material'
import {SideDrawer} from '../components/SideDrawer'
import { MyChats } from '../components/MyChats'
import { ChatBox } from '../components/ChatBox'

export const Homepage = () => {
  // const { user } = ChatState()

  const user = JSON.parse(localStorage.getItem('loggedInUser'))
  const [fetch, setFetch]= useState(false)

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        width="100%"
        justifyContent="space-between"
        height= "91.5vh"
        gap={1}
        sx={{ padding: "10px", boxSizing: "border-box"}}
        >
        {user && <MyChats fetch={fetch} setFetch={setFetch} />}
        {user && <ChatBox fetch={fetch} setFetch={setFetch}/>}
      </Box>
    </div>
  )
}
