import express from 'express'

import { authMiddleware } from '../middleware/authMiddleware.js'
import { searchUsers } from '../controllers/userControllers.js'

export const userRouter = express.Router()

userRouter.get('/', authMiddleware, searchUsers)

