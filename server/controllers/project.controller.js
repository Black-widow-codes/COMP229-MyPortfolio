
import Project from '../models/project.model.js'
import errorHandler from './error.controller.js'

// Create a new project
const create = async (req, res) => {
  const project = new Project(req.body)

  try {
    await project.save()
    return res.status(201).json(project)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

// Retrieve all projects
const list = async (req, res) => {
  try {
    const projects = await Project.find()
    return res.status(200).json(projects)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

// Retrieve one project by ID
const read = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      })
    }

    return res.status(200).json(project)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


// Update an existing project by ID
const update = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      req.body,
      { new: true, runValidators: true }
    )

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      })
    }

    return res.status(200).json(project)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


// Delete a project by ID
const remove = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(
      req.params.projectId
    )

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      })
    }

    return res.status(200).json({
      message: 'Project deleted successfully'
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


 // Delete all projects
const removeAll = async (req, res) => {
  try {
    const result = await Project.deleteMany({})

    return res.status(200).json({
      message: 'All projects deleted successfully',
      deletedCount: result.deletedCount
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


export default { create, list, read, update, remove, removeAll }
