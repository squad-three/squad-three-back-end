'use strict'
// Bucket list object
const mongoose = require('mongoose')

const bucketSchema = new mongoose.Schema({
  // DataTables wants an array with elements that look like this:
  // [ { description: '1',
  //   category: 'Achievement',
  //   location: '1',
  //   duration: '1',
  //   cost: '1',
  //   status: 'Some Day',
  //   DT_RowId: '923944',
  //   _owner: 59526e965a568c1c80df150e } ]
  description: {type: String, required: false},
  category: {type: String, required: false},
  location: {type: String, required: false},
  duration: {type: String, required: false},
  cost: {type: String, required: false},
  status: {type: String, required: false},
  DT_RowId: {type: String, required: false},
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

const Bucket = mongoose.model('Bucket', bucketSchema)

module.exports = Bucket
