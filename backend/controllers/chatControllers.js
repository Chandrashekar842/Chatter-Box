import asyncHandler from "express-async-handler";

import { User } from "../models/User.js";
import { Chat } from "../models/Chat.js";

export const accessChat = asyncHandler(async (req, res, next) => {
  const userId = req.body.userId;

  if (!userId) {
    console.log("userID param is not sent with request");
    return res.status(400);
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

export const fetchChat = asyncHandler(async (req, res, next) => {
  try {
    await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const createGroupChat = asyncHandler(async (req, res, next) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({ message: "Please enter all the fields" });
  }

  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .json({ message: "Group should contain more than 2 members!" });
  }
  users.push(req.user._id);

  try {
    const newGroup = await Chat.create({
      isGroupChat: true,
      users: users,
      chatName: req.body.name,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.find({ _id: newGroup._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json({ group: fullGroupChat });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const addToGroup = asyncHandler(async (req, res, next) => {
    const { chatId, userId } = req.body

    const updatedChat = await Chat.findByIdAndUpdate(chatId, {
        $push: { users: userId }
    }, {
        new: true
    })

    if(!updatedChat) {
        res.status(400)
        throw new Error('No chat found!!')
    } else {
        res.status(200).json({ chat:  updatedChat })
    }
});

export const removeFromGroup = asyncHandler(async (req, res, next) => {
    const { chatId, userId } = req.body

    const updatedChat = await Chat.findByIdAndUpdate(chatId, {
        $pull: { users: userId }
    }, {
        new: true
    })

    if(!updatedChat) {
        res.status(400)
        throw new Error('No chat found!!')
    } else {
        res.status(200).json({ chat:  updatedChat })
    }
});

export const renameGroup = asyncHandler(async (req, res, next) => {
    const { chatId, chatName } = req.body

    const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName: chatName }, { new: true })

    if(!updatedChat) {
        res.status(400)
        throw new Error("No chat found")
    } else {
        res.status(200).json({ chat: updatedChat })
    }
});
