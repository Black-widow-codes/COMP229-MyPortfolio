
import mongoose from 'mongoose'

const QualificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  period: {
    type: String,
    required: true,
    trim: true
  },
  institution: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

export default mongoose.model('Qualification', QualificationSchema)
