import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn:'30d'
    })
}

export const registerUser = asyncHandler (async (req, res, next) => {
    const { name, email, password } = req.body

    if(!name || !email || !password) {
        res.status(400)
        throw new Error("Please enter all fields")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
        name: name,
        email: email,
        password: hashedPassword
    })
    if(user) {
        res.status(200).json({ user: user })
    } else {
        res.status(400)
        throw new Error('Failed to create user!!')
    }
})

export const loginUser = asyncHandler( async (req, res, next) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if(user) {
        await bcrypt
                .compare(password, user.password)
                .then((doMatch) => {
                    if(doMatch) {
                        const token = generateToken(user._id)
                        res.status(200).json({
                            message: "login successful",
                            user: user,
                            token: token
                        })
                    } else {
                        res.status(401)
                        throw new Error("Invalid Password")
                    }
                })
    } else {
        res.status(401)
        throw new Error("Invalid Email or Password")
    }
} )