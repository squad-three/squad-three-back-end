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
    console.log('Database contains: ', bucketRows)
    res.json({data: bucketRows.map((e) =>
        e.toJSON({ user: req.user }))
    })
  })
  .catch(next)
  console.log('Index: ', req.body)
}

const create = (req, res, next) => {
  // Date.now() is integer number of milliseconds since start of UNIX epoch
  req.body.data[0].DT_RowId = Date.now()
  const bucketRow = Object.assign(req.body.data[0], {_owner: req.user._id
  })

  // Mongo wants to see this:
  // bucketRow:  { description: '5',
  // category: 'Achievement',
  // location: '5',
  // duration: '5',
  // cost: '5',
  // status: 'Some Day',
  // DT_RowId: '764725',
  // _owner: 59526e965a568c1c80df150e }
  console.log('bucketRow: ', bucketRow)
  Bucket.create(bucketRow)
    .then(bucketRow => {
      res.status(201).json(req.body)
      Bucket.find({ _owner: req.user._id })
      .then(bucketRows => {
        console.log('Database contains: ', bucketRows)
      })
    })
    .catch(next)
  console.log('Create: returning ', req.body.data)
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
