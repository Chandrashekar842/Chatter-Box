import { validationResult } from "express-validator";

export const checkValidation = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ err: errors.array() })
    }
    next()
}