'use strict'

const HttpError = require('lib/wiring/errors/http-error')

const setMongooseModel = (model, options) =>
  function (req, res, next) {
    const search = { DT_RowId: req.params.id }
    if (options && options.forUser) {
      search._owner = req.user
    }
    console.log('search is ', search)

    model.findOne(search, (error, document) => {
      console.log('error is ', error)
      console.log('document is ', document)
      console.log('here')
      error = error || !document && new HttpError(404)
      if (error) {
        console.log('now here')
        return next(error)
      }
      req[model.modelName.toLowerCase()] = document
      console.log('This is ', req[model.modelName.toLowerCase()])
      next()
    })
  }

module.exports = setMongooseModel
