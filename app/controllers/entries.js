'use strict'

const controller = require('lib/wiring/controller')
const models = require('app/models')
const Entry = models.entry

const authenticate = require('./concerns/authenticate')
const setUser = require('./concerns/set-current-user')
const setModel = require('./concerns/set-mongoose-model')

const index = (req, res, next) => {
  Entry.find()
    .then(entries => res.json({
      entries: entries.map((e) =>
        e.toJSON({ virtuals: true, user: req.user }))
    }))
    .catch(next)
}

const create = (req, res, next) => {
  const entry = Object.assign(req.body.entry, {
    _owner: req.user._id
  })
  Entry.create(entry)
    .then(entry =>
      res.status(201)
        .json({
          entry: entry.toJSON({ virtuals: true, user: req.user })
        }))
    .catch(next)
}

const update = (req, res, next) => {
  delete req.body._owner  // disallow owner reassignment.
  req.entry.update(req.body.entry)
    .then(() => res.sendStatus(204))
    .catch(next)
}

const destroy = (req, res, next) => {
  req.entry.remove()
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
  { method: setModel(Entry, { forUser: true }), only: ['update', 'destroy'] }
] })
