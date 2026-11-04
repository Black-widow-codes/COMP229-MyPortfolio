
import Qualification from '../models/qualification.model.js'
import errorHandler from './error.controller.js'

// Create a qualification
const create = async (req, res) => {
  try {
    const qualification = new Qualification(req.body)
    await qualification.save()
    return res.status(201).json(qualification)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

// Retrieve all qualifications
const list = async (req, res) => {
  try {
    const qualifications = await Qualification.find()
    return res.status(200).json(qualifications)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

// Retrieve one qualification by ID
const read = async (req, res) => {
  try {
    const qualification = await Qualification.findById(
      req.params.qualificationId
    )

    if (!qualification) {
      return res.status(404).json({
        error: 'Qualification not found'
      })
    }

    return res.status(200).json(qualification)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

// Update a qualification by ID
const update = async (req, res) => {
  try {
    const qualification = await Qualification.findByIdAndUpdate(
      req.params.qualificationId,
      req.body,
      { new: true, runValidators: true }
    )

    if (!qualification) {
      return res.status(404).json({
        error: 'Qualification not found'
      })
    }

    return res.status(200).json(qualification)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

// Delete one qualification by ID
const remove = async (req, res) => {
  try {
    const qualification = await Qualification.findByIdAndDelete(
      req.params.qualificationId
    )

    if (!qualification) {
      return res.status(404).json({
        error: 'Qualification not found'
      })
    }

    return res.status(200).json({
      message: 'Qualification deleted successfully'
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

// Delete all qualifications
const removeAll = async (req, res) => {
  try {
    const result = await Qualification.deleteMany({})

    return res.status(200).json({
      message: 'All qualifications deleted successfully',
      deletedCount: result.deletedCount
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

export default { create, list, read, update, remove, removeAll }
