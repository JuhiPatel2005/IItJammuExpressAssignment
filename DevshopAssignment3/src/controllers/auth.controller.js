const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

//Helper create a JWT token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, name: user.email, role: user.role}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE,
    })
}

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, message: "No account found with that email" })
        }

        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })

        res.status(200).json({
            success: true,
            message: "Password reset token generated successfully",
            resetToken,
        })
    } catch (error) {
        next(error)
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body

        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: "Token and new password are required" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        user.password = newPassword
        await user.save()

        res.status(200).json({ success: true, message: "Password reset successfully" })
    } catch (error) {
        next(error)
    }
}

const register = async (req, res, next) => {
    try{
        const {name, email, password, role} = req.body

        const exists = await User.findOne({email});
        if(exists){
            return res.status(400).json({
                success: false, message: "Email already exists"
            })
        }

        const user = await User.create({name, email, password, role});

        res.status(201).json({
            success: true,
            token: generateToken(user),
            user: {
                id: user._id, name: user.name, email: user.email, role: user.role
            }
        })

    }catch(error){
        next(error)
    }
}

const login = async (req, res, next) => {
    try{
        const {email, password} = req.body

        if(!email || !password){
            return res.status(400).json({
                success: false, message: "Email & Password requried"
            })
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const isMatch = await user.matchPassword(password)

        if(!isMatch){
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        res.status(201).json({
            success: true,
            token: generateToken(user),
            user: {
                id: user._id, name: user.name, email: user.email, role: user.role
            }
        })

    }catch(error){
        next(error)
    }
}

const getMe = async (req, res, next) => {
    try{
        res.json({
            success: true, user: req.user
        })
    }catch(error){
        next(error)
    }
}

module.exports = {register, login, getMe, forgotPassword, resetPassword}