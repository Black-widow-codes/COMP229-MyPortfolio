import Contact from '../models/contact.model.js'
import errorHandler from './error.controller.js'

const create = async (req, res) => {
  const contact = new Contact(req.body)

  try {
    await contact.save()
    return res.status(201).json(contact)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const list = async (req, res) => {
    try {
      const contacts = await Contact.find()
      return res.json(contacts)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  }

  const contactByID = async (req, res, next, id) => {
    try {
      const contact = await Contact.findById(id)
  
      if (!contact) {
        return res.status(404).json({
          error: 'Contact not found'
        })
      }
  
      req.contact = contact
      next()
    } catch (err) {
      return res.status(400).json({
        error: 'Could not retrieve contact'
      })
    }
  }

  // Return a single contact that was retrieved by contactByID
const read = (req, res) => {
  return res.json(req.contact)
}

// Update an existing contact
const update = async (req, res) => {
  try {
    const contact = req.contact

    contact.firstname = req.body.firstname ?? contact.firstname
    contact.lastname = req.body.lastname ?? contact.lastname
    contact.email = req.body.email ?? contact.email

    await contact.save()

    return res.json(contact)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

// Delete an individual contact
const remove = async (req, res) => {
  try {
    const contact = req.contact

    await Contact.findByIdAndDelete(contact._id)

    return res.json({
      message: 'Contact deleted successfully'
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

// Delete all contacts from the MongoDB contacts collection
const removeAll = async (req, res) => {
  try {
    const result = await Contact.deleteMany({})

    return res.json({
      message: 'All contacts deleted successfully',
      deletedCount: result.deletedCount
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

export default { create, list, contactByID, read, update, remove, removeAll }