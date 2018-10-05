'use strict'
import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
  first_name: {
    type: String,
    Required: 'Please enter'
  },
  last_name: {
    type: String,
    Required: 'Please enter'
  },
    // missed left last_name
  email: {
    type: String,
    Required: 'Please enter'
  },
  Created_date: {
    type: Date,
    default: Date.now

  }
})

export default mongoose.model('users', UserSchema)