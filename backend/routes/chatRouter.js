import express from "express";

import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  accessChat,
  fetchChat,
  createGroupChat,
  addToGroup,
  removeFromGroup,
  renameGroup,
} from "../controllers/chatControllers.js";

export const chatRouter = express.Router();

chatRouter.post("/", authMiddleware, accessChat);

chatRouter.get("/", authMiddleware, fetchChat);

chatRouter.post('/group', authMiddleware, createGroupChat)

chatRouter.put('/group-rename', authMiddleware, renameGroup)

chatRouter.put('/add-to-group', authMiddleware, addToGroup)

chatRouter.put('/remove-user', authMiddleware, removeFromGroup)
