import express from 'express'
import { body } from 'express-validator'

import { registerUser, loginUser } from '../controllers/authControllers.js'
import { checkValidation } from '../middleware/validationCheck.js'
import { User } from '../models/User.js'

export const authRouter = express.Router()

authRouter.post(
    "/register",
    [
      body("email")
          .isEmail()
          .withMessage("Enter a valid Email Id")
          .custom(async (value) => {
              const user = await User.findOne({ email: value })
              if(user) {
                  throw new Error("User already registered!!!")
              }
          }),
      body("name").isLength({ min: 6 }).withMessage("Name should be of 6 characters"),
      body("password")
        .isStrongPassword({
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage(
          "Password must be at least 6 characters long and contain at least one uppercase letter, one number, and one special character."
        ),
    ],
    checkValidation,
    registerUser
  );
  
  authRouter.post("/login", [
      body('email').isEmail().withMessage("Enter a valid email Id")
  ], loginUser);