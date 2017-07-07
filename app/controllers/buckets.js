'use strict'

const controller = require('lib/wiring/controller')
const models = require('app/models')
const Bucket = models.bucket

const authenticate = require('./concerns/authenticate')
const setUser = require('./concerns/set-current-user')
const setModel = require('./concerns/set-mongoose-model')

const index = (req, res, next) => {
  // DataTables wants an array with elements that look like this:
  // [ { description: '1',
  //   category: 'Achievement',
  //   location: '1',
  //   duration: '1',
  //   cost: '1',
  //   status: 'Some Day',
  //   DT_RowId: '923944',
  //   _owner: 59526e965a568c1c80df150e } ]
  Bucket.find({ _owner: req.user._id })
  .then(bucketRows => {
    // Verify each row contains a DT_RowId; if not, create one.
    // Also replaces short (<13 character) DT_RowIds that were created
    //   in earlier versions; these have a small chance of being
    //   duplicates for the same user across different rows.s
    // DT_RowId should be a string containing a timestamp.
    // If multiple rows need timestamps, duplicate values could be created here at processor-speed.
    // Therefore, grab the current timestamp and decrement it
    //  if we need a 2nd, 3rd, etc.
    // No need to store the assigned DT_RowId. If this row is updated,
    //  the value will be stored then.
    // If the row is read again before an update, we'll just create
    //  a new DT_RowId value at that time, which is sufficient to
    //  keep the client's DataTables happy.
    let timestamp = Date.now()
    bucketRows.forEach(row => {
      if (!row.DT_RowId || row.DT_RowId.length < 13) {
        // DT_RowId should be a string
        row.DT_RowId = timestamp.toString()
        timestamp -= 1
      }
    })
    res.json({data: bucketRows.map((e) =>
        e.toJSON({ user: req.user }))
    })
  })
  .catch(next)
}

const create = (req, res, next) => {
  // Date.now() is integer number of milliseconds since start of UNIX epoch
  // Convert it to a string when assigning it to DT_RowId
  req.body.data[0].DT_RowId = Date.now().toString()
  const bucketRow = Object.assign(req.body.data[0], {_owner: req.user._id
  })

  // Mongo wants to see this:
  // bucketRow:  { description: '5',
  // category: 'Achievement',
  // location: '5',
  // duration: '5',
  // cost: '5',
  // status: 'Some Day',
  // DT_RowId: '764725…',
  // _owner: 59526e965a568c1c80df150e }
  Bucket.create(bucketRow)
    .then(bucketRow => {
      res.status(201).json(req.body)
      Bucket.find({ _owner: req.user._id })
      .then(bucketRows => {
      })
    })
    .catch(next)
}

const update = (req, res, next) => {
  delete req.body._owner  // disallow owner reassignment.
  req.body.data[req.params.id].DT_RowId = req.params.id
  req.bucket.update(req.body.data[req.params.id])
    .then(() => res.json({data: [req.body.data[req.params.id]]}))
    .catch(next)
}

const destroy = (req, res, next) => {
  req.bucket.remove()
    .then(() => res.sendStatus(204))
    .catch(next)
}

module.exports = controller({
  index,
  create,
  update,
  destroy
}, { before: [
 { method: setUser, only: ['index'] },
 { method: authenticate, except: ['index'] },
 { method: setModel(Bucket, { forUser: true }), only: ['update', 'destroy'] }
] })
