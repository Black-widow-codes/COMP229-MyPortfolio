
import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  outcome: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: ''
  },
  completion: {
    type: Date
  }
}, {
  timestamps: true
})

export default mongoose.model('Project', ProjectSchema)
