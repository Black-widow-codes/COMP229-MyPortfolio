
import { expressjwt } from 'express-jwt'
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import config from '../../config/config.js'

const signin = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email
    })

    if (!user || !user.authenticate(req.body.password)) {
      return res.status(401).json({
        error: 'Invalid email or password'
      })
    }

    const token = jwt.sign(
      { _id: user._id.toString() },
      config.jwtSecret,
      { expiresIn: '2h' }
    )

    res.cookie('t', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000,
      secure: config.env === 'production'
    })

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      }
    })
  } catch (err) {
    return res.status(500).json({
      error: 'Could not sign in'
    })
  }
}

const signout = (req, res) => {
  res.clearCookie('t', {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.env === 'production'
  })

  return res.status(200).json({
    message: 'Signed out successfully'
  })
}

const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ['HS256'],
  userProperty: 'auth'
})

const hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile &&
    req.auth &&
    req.profile._id.toString() === req.auth._id.toString()

  if (!authorized) {
    return res.status(403).json({
      error: 'User is not authorized'
    })
  }

  next()
}

const requireAdmin = async (req, res, next) => {
  try {
    if (!req.auth?._id) {
      return res.status(401).json({
        error: 'Authentication required'
      })
    }

    const user = await User.findById(req.auth._id)

    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        error: 'Admin access required'
      })
    }

    next()
  } catch (err) {
    return res.status(500).json({
      error: 'Could not verify administrator'
    })
  }
}

export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
  requireAdmin
}
