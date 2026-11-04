
import express from 'express'
import projectCtrl from '../controllers/project.controller.js'

const router = express.Router()
// Retrieve, create, or delete all projects
router.route('/api/projects')
  .get(projectCtrl.list)
  .post(projectCtrl.create)
  .delete(projectCtrl.removeAll)

  
  // Retrieve, update, or delete a project by ID
  router.route('/api/projects/:projectId')
    .get(projectCtrl.read)
    .put(projectCtrl.update)
    .delete(projectCtrl.remove)
  

export default router
