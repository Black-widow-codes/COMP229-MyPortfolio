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

export default { create, list, contactByID }