import asyncHandler from "express-async-handler";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import { Chat } from "../models/Chat.js";

export const sendMessage = asyncHandler(async (req, res, next) => {
    const { chatId, content } = req.body

    if(!content || !chatId) {{
        console.log('Innvalid data passed into request')
        return res.statusCode(400)
    }}

    const newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {
        let message = await Message.create(newMessage)

        message = await message.populate('sender', 'name email')
        message = await message.populate('chat')
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name email',
        })
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message })

        res.json(message)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

export const fetchMessages = asyncHandler(async (req, res, next) => {
    const chatId = req.params.chatId
    try {
        const messages = await Message.find({chat: chatId})
            .populate('sender', 'name pic')
            .populate('chat')
        res.json(messages)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})