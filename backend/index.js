import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from 'http'

import { dbConnect } from "./config/dbConnect.js";
import { notFound, errorHandler } from "./middleware/errMiddleware.js";
import { authRouter } from "./routes/authRouter.js";
import { userRouter } from "./routes/userRouter.js";
import { chatRouter } from "./routes/chatRouter.js";
import { messageRouter } from "./routes/messageRouter.js";
import path from "path";

const app = express();
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*'
  },
  pingTimeout: 60000
})

app.use(express.json());

app.use(cors());

app.use('/auth', authRouter)

app.use('/user', userRouter)

app.use('/chat', chatRouter)

app.use('/message', messageRouter)

// ======================== Deployment =====================

// const __dirname1 = path.resolve()
// if(process.env.NODE_ENV === 'production' ) {
//   const newPath = path.join(__dirname1, '..')
//   app.use(express.static(path.join(newPath ,'/frontend/dist')))

//   app.get('*', (req, res) => {
//     res.sendFile(path.join(newPath, "frontend", "dist", "index.html"))
//   })
// } else {
//   app.get('/', (req, res) => {
//     res.send('API is running')
//   })
// }

// ======================== Deployment =====================

app.use(notFound)

app.use(errorHandler)

dbConnect().then(() => {
  server.listen(process.env.PORT, () => {
    console.log("Connected to the server at port:", process.env.PORT);
  });
});

io.on('connection', (socket) => {
  console.log('connected to socket')

  socket.on('setup', (userData) => {
    socket.join(userData._id)
    socket.emit("connected")
  })

  socket.on('join chat', (room) => {
    socket.join(room)
    console.log('user joined room', room);
  })

  socket.on('typing', (room) => socket.in(room).emit('typing'))

  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

  socket.on('new message', (newMessageReceived) => {
    let chat = newMessageReceived.chat

    if(!chat.users) return console.log("chat.users is not defined");

    chat.users.forEach(user => {
      if(user._id ===  newMessageReceived.sender._id) {
        return
      }
      socket.in(user._id).emit("message received", newMessageReceived)
    })
  })

  socket.off('setup', () => {
    console.log('user disconnected');
    socket.leave(userData.__id)
  })
})
