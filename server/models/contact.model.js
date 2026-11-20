
import mongoose from 'mongoose'

const ContactSchema = new mongoose.Schema({
  firstname: {
    type: String,
    trim: true,
    required: true
  },
  lastname: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  message: {
    type: String,
    trim: true,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Contact', ContactSchema)
