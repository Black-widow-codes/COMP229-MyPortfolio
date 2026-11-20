
import express from 'express'
import contactCtrl from '../controllers/contact.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

// Visitors can submit contact messages.
// Only Admin can view all messages.
router.route('/api/contacts')
  .post(contactCtrl.create)
  .get(
    authCtrl.requireSignin,
    authCtrl.requireAdmin,
    contactCtrl.list
  )

// Only Admin can view, update, or delete messages.
router.route('/api/contacts/:contactId')
  .get(
    authCtrl.requireSignin,
    authCtrl.requireAdmin,
    contactCtrl.read
  )
  .put(
    authCtrl.requireSignin,
    authCtrl.requireAdmin,
    contactCtrl.update
  )
  .delete(
    authCtrl.requireSignin,
    authCtrl.requireAdmin,
    contactCtrl.remove
  )

// Load contact by ID
router.param('contactId', contactCtrl.contactByID)

export default router
