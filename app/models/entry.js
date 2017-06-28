'use strict'

const mongoose = require('mongoose')

const entrySchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: false
  },
  duration: {
    type: String,
    required: false
  },
  cost: {
    type: Number,
    required: false
  },
  status: {
    type: String,
    required: true
  },
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret, options) {
      const userId = (options.user && options.user._id) || false
      ret.editable = userId && userId.equals(doc._owner)
      return ret
    }
  }
})

const Entry = mongoose.model('Entry', entrySchema)

module.exports = Entry
