const User = require("../models/user.model")

// Create user
const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    const userResponse = user.toObject()
    delete userResponse.password

    res.status(201).json({ success: true, data: userResponse })
  } catch (error) {
    next(error)
  }
}

// Get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password")
    res.json({ success: true, count: users.length, data: users })
  } catch (error) {
    next(error)
  }
}

// Get single user
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password")
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }
    res.json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}

// Update user
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    const { password, ...rest } = req.body

    Object.assign(user, rest)

    if (password) {
      user.password = password
    }

    await user.save()

    const userResponse = user.toObject()
    delete userResponse.password

    res.json({ success: true, data: userResponse })
  } catch (error) {
    next(error)
  }
}

// Delete user
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }
    res.json({ success: true, message: "User deleted successfully" })
  } catch (error) {
    next(error)
  }
}

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser }
