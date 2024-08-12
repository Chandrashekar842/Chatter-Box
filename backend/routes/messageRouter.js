import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { fetchMessages, sendMessage } from '../controllers/messageControllers.js'

export const messageRouter = express.Router()

messageRouter.post('/', authMiddleware, sendMessage)

messageRouter.get('/:chatId', authMiddleware, fetchMessages)