
import userCtrl from '../controllers/user.controller.js'
import authCtrl from '../controllers/auth.controller.js'
import express from 'express'

const router = express.Router()

// Public signup
router.route('/api/users')
  .post(userCtrl.create)

// User listing
router.route('/api/users')
  .get(authCtrl.requireSignin, userCtrl.list)

// Find user by ID
router.param('userId', userCtrl.userByID)

// Individual user operations
router.route('/api/users/:userId')
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    userCtrl.update
  )
  .delete(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    userCtrl.remove
  )

export default router
