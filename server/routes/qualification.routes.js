
import express from 'express'
import qualificationCtrl from '../controllers/qualification.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

// View all qualifications (public)
// Create qualifications (Admin only)
router.route('/api/qualifications')
  .get(qualificationCtrl.list)
  .post(
    authCtrl.requireSignin,
    authCtrl.requireAdmin,
    qualificationCtrl.create
  )

// View one qualification (public)
// Update or delete a qualification (Admin only)
router.route('/api/qualifications/:qualificationId')
  .get(qualificationCtrl.read)
  .put(
    authCtrl.requireSignin,
    authCtrl.requireAdmin,
    qualificationCtrl.update
  )
  .delete(
    authCtrl.requireSignin,
    authCtrl.requireAdmin,
    qualificationCtrl.remove
  )

export default router
