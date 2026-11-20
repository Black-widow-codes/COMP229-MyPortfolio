
import express from 'express'
import projectCtrl from '../controllers/project.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

// Public routes: anyone can view projects
router.get('/api/projects', projectCtrl.list)
router.get('/api/projects/:projectId', projectCtrl.read)

// Protected routes: only admins can modify projects
router.post(
  '/api/projects',
  authCtrl.requireSignin,
  authCtrl.requireAdmin,
  projectCtrl.create
)

router.put(
  '/api/projects/:projectId',
  authCtrl.requireSignin,
  authCtrl.requireAdmin,
  projectCtrl.update
)

router.delete(
  '/api/projects/:projectId',
  authCtrl.requireSignin,
  authCtrl.requireAdmin,
  projectCtrl.remove
)

export default router
