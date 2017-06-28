'use strict'
// Bucket list object
const mongoose = require('mongoose')

const bucketSchema = new mongoose.Schema({
  bucketTable: [{
    type: mongoose.Schema.Types.Mixed,
    required: true
  }],
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret, options) {
      const userId = (options.user && options.user._id) || false
      ret.editable = userId && userId.equals(doc._owner)
      return ret
    }
  }
})

const Bucket = mongoose.model('Bucket', bucketSchema)

module.exports = Bucket
