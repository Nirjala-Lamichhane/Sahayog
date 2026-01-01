// controllers/authController.js
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// LOGIN USER
export const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' })

    const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1d' })

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// OPTIONAL: REGISTER USER
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.status(400).json({ message: 'Email already exists' })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({ username, email, password: hashedPassword })
    const savedUser = await user.save()

    const token = jwt.sign({ id: savedUser._id }, 'secret_key', {
      expiresIn: '1d',
    })

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: savedUser._id,
        email: savedUser.email,
        username: savedUser.username,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}
