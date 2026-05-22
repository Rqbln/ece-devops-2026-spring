const express = require('express')
const commentsController = require('../controllers/comments')

const commentsRouter = express.Router()

commentsRouter
  .get('/', (req, resp) => {
    commentsController.list((err, comments) => {
      if (err) {
        return resp.status(500).json({ status: 'error', msg: err.message })
      }
      return resp.status(200).json({ status: 'success', comments })
    })
  })
  .post('/', (req, resp) => {
    commentsController.add(req.body, (err, res) => {
      if (err) {
        return resp.status(400).json({ status: 'error', msg: err.message })
      }
      return resp.status(201).json({ status: 'success', msg: res })
    })
  })

module.exports = commentsRouter
