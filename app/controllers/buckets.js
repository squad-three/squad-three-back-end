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
  // Math.random returns a random float between 0 & 1
  req.body.data[0].DT_RowId = new Date().getUTCMilliseconds().toString()
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
  // console.log('Destroy: req.params = ', req.params)
  // console.log('Destory: req.query = ', req.quer)
  // res.sendStatus(204)
  console.log('req.bucket is ', req.bucket)
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
 { method: authenticate, except: ['index'] }, // Probably want to remove entirely
 { method: setModel(Bucket, { forUser: true }), only: ['update', 'destroy'] }
] })
