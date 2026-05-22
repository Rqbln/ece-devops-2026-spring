const express = require('express')
const statsController = require('../controllers/stats')

const statsRouter = express.Router()

statsRouter.get('/', (req, resp) => {
  statsController.get((err, stats) => {
    if (err) {
      return resp.status(500).json({ status: 'error', msg: err.message })
    }
    return resp.status(200).json({ status: 'success', stats })
  })
})

module.exports = statsRouter
