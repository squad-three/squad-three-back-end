'use strict'

const controller = require('lib/wiring/controller')
const models = require('app/models')
const Bucket = models.bucket

const authenticate = require('./concerns/authenticate')
const setUser = require('./concerns/set-current-user')
const setModel = require('./concerns/set-mongoose-model')

const index = (req, res, next) => {
  // Bucket.find()
  //   .then(Buckets => res.json({
  //     Buckets: Buckets.map((e) =>
  //       e.toJSON({ virtuals: true, user: req.user }))
  //   }))
  //   .catch(next)
  req.body.data = []
  console.log('Index: ', req.body)
  res.status(201).json(req.body)
}

const show = (req, res) => {
  res.json({
    Bucket: req.Bucket.toJSON({ virtuals: true, user: req.user })
  })
}

const create = (req, res, next) => {
  // Math.random returns a random float between 0 & 1
  req.body.data[0].DT_RowId = Math.trunc(Math.random() * 1000000.0).toString()
  const bucketRow = Object.assign(req.body.data[0], {
    _owner: req.user._id
  })
  Bucket.create(bucketRow)
    .then(bucketRow => res.status(201).json(req.body))
    .catch(next)
  console.log('Create: returning ', req.body.data)
}

const update = (req, res, next) => {
  // delete req.body._owner  // disallow owner reassignment.
  // req.Bucket.update(req.body.Bucket)
  //   .then(() => res.sendStatus(204))
  //   .catch(next)
  console.log('Update: received & returning: ', req.body.data)
  res.status(201).json(req.body)
}

const destroy = (req, res, next) => {
  // req contains
  // req.params: { id: '42' },
  // req.query: { action: 'remove', data: { '42': [Object] } },
  console.log('Destroy: req.params = ', req.params)
  console.log('Destory: req.query = ', req.quer)
  res.sendStatus(204)
  // req.Bucket.remove()
  //   .then(() => res.sendStatus(204))
    // .catch(next)
}

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy
}, { before: [
 { method: setUser, only: ['index', 'show'] },
 { method: authenticate, except: ['index', 'show'] },
 { method: setModel(Bucket), only: ['show'] }
// { method: setModel(Bucket, { forUser: true }), only: ['update', 'destroy'] }
] })
