'use strict'

const controller = require('lib/wiring/controller')
const models = require('app/models')
const Bucket = models.bucket

const authenticate = require('./concerns/authenticate')
const setUser = require('./concerns/set-current-user')
const setModel = require('./concerns/set-mongoose-model')

const index = (req, res, next) => {
  Bucket.find()
    .then(Buckets => res.json({
      Buckets: Buckets.map((e) =>
        e.toJSON({ virtuals: true, user: req.user }))
    }))
    .catch(next)
}

const show = (req, res) => {
  res.json({
    Bucket: req.Bucket.toJSON({ virtuals: true, user: req.user })
  })
}

const create = (req, res, next) => {
  // const Bucket = Object.assign(req.body.data, {
  //   _owner: req.user._id
  // })
  // Bucket.create(Bucket)
  //   .then(Bucket =>
  //     res.status(201)
  //       .json({
  //         Bucket: Bucket.toJSON({ virtuals: true, user: req.user })
  //       }))
    // .catch(next)
  res.status(201).json(req.body)
}

const update = (req, res, next) => {
  delete req.body._owner  // disallow owner reassignment.
  req.Bucket.update(req.body.Bucket)
    .then(() => res.sendStatus(204))
    .catch(next)
}

const destroy = (req, res, next) => {
  debugger
  req.Bucket.remove()
    .then(() => res.sendStatus(204))
    .catch(next)
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
 { method: setModel(Bucket), only: ['show'] },
 { method: setModel(Bucket, { forUser: true }), only: ['update', 'destroy'] }
] })
