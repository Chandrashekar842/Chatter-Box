import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'

import { User } from '../models/User.js';

export const authMiddleware =asyncHandler( async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if(!token) {
        res.status(401)
        throw new Error("Unauthorised, No token Provided")
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.userId).select("-password")
        next()
    } catch(err) {
        res.status(401)
        throw new Error("Invalid Token")
    }
})