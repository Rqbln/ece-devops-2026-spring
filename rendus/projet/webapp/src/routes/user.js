const express = require('express')
const userController = require('../controllers/user')

const userRouter = express.Router()

userRouter
  .get('/', (req, resp) => {
    userController.list((err, users) => {
      if (err) {
        return resp.status(500).json({ status: 'error', msg: err.message })
      }
      return resp.status(200).json({ status: 'success', users })
    })
  })
  .post('/', (req, resp) => {
    userController.create(req.body, (err, res) => {
      if (err) {
        return resp.status(400).json({ status: 'error', msg: err.message })
      }
      return resp.status(201).json({ status: 'success', msg: res })
    })
  })
  .get('/:username', (req, resp) => {
    userController.get(req.params.username, (err, user) => {
      if (err || !user) {
        return resp.status(404).json({
          status: 'error',
          msg: err ? err.message : 'User does not exist'
        })
      }
      return resp.status(200).json({
        status: 'success',
        user: {
          username: req.params.username,
          firstname: user.firstname,
          lastname: user.lastname
        }
      })
    })
  })
  .put('/:username', (req, resp) => {
    userController.update(req.params.username, req.body, (err, res) => {
      if (err) {
        return resp.status(400).json({ status: 'error', msg: err.message })
      }
      return resp.status(200).json({ status: 'success', msg: res })
    })
  })
  .delete('/:username', (req, resp) => {
    userController.remove(req.params.username, (err, res) => {
      if (err) {
        return resp.status(404).json({ status: 'error', msg: err.message })
      }
      return resp.status(200).json({ status: 'success', msg: res })
    })
  })

module.exports = userRouter
