import express from 'express'
import contactCtrl from '../controllers/contact.controller.js'

const router = express.Router()

// Create, retrieve, or delete all contacts
router.route('/api/contacts')
  .post(contactCtrl.create)
  .get(contactCtrl.list)
  .delete(contactCtrl.removeAll)

// Retrieve, update, or delete an individual contact by ID
router.route('/api/contacts/:contactId')
  .get(contactCtrl.read)
  .put(contactCtrl.update)
  .delete(contactCtrl.remove)

// Load the contact when a contactId is provided
router.param('contactId', contactCtrl.contactByID)

export default router