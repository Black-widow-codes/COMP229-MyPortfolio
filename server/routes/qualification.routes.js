
import express from 'express'
import qualificationCtrl from '../controllers/qualification.controller.js'

const router = express.Router()

// Retrieve all, create, or delete all qualifications
router.route('/api/qualifications')
  .get(qualificationCtrl.list)
  .post(qualificationCtrl.create)
  .delete(qualificationCtrl.removeAll)

// Retrieve, update, or delete one qualification by ID
router.route('/api/qualifications/:qualificationId')
  .get(qualificationCtrl.read)
  .put(qualificationCtrl.update)
  .delete(qualificationCtrl.remove)

export default router
