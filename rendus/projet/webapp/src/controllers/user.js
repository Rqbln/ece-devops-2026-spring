const db = require('../dbClient')
const { USERS_INDEX } = require('../constants')

module.exports = {
  create: (user, callback) => {
    if (!user.username) {
      return callback(new Error('Wrong user parameters'), null)
    }

    const userObj = {
      firstname: user.firstname || '',
      lastname: user.lastname || ''
    }

    db.exists(user.username, (err, exists) => {
      if (err) return callback(err, null)
      if (exists) return callback(new Error('User already exists'), null)

      db.hmset(user.username, userObj, (hmsetErr) => {
        if (hmsetErr) return callback(hmsetErr, null)
        db.sadd(USERS_INDEX, user.username, (saddErr, res) => {
          if (saddErr) return callback(saddErr, null)
          callback(null, res)
        })
      })
    })
  },

  get: (username, callback) => {
    if (!username) {
      return callback(new Error('Wrong user parameters'), null)
    }

    db.hgetall(username, (err, user) => {
      if (err) return callback(err, null)
      if (!user || Object.keys(user).length === 0) {
        return callback(new Error('User does not exist'), null)
      }
      callback(null, user)
    })
  },

  list: (callback) => {
    db.smembers(USERS_INDEX, (err, usernames) => {
      if (err) return callback(err, null)
      callback(null, usernames || [])
    })
  },

  update: (username, data, callback) => {
    if (!username) {
      return callback(new Error('Wrong user parameters'), null)
    }

    db.exists(username, (err, exists) => {
      if (err) return callback(err, null)
      if (!exists) return callback(new Error('User does not exist'), null)

      const updates = {}
      if (data.firstname !== undefined) updates.firstname = data.firstname
      if (data.lastname !== undefined) updates.lastname = data.lastname

      if (Object.keys(updates).length === 0) {
        return callback(new Error('No fields to update'), null)
      }

      db.hmset(username, updates, (hmsetErr, res) => {
        if (hmsetErr) return callback(hmsetErr, null)
        callback(null, res)
      })
    })
  },

  remove: (username, callback) => {
    if (!username) {
      return callback(new Error('Wrong user parameters'), null)
    }

    db.del(username, (err) => {
      if (err) return callback(err, null)
      db.srem(USERS_INDEX, username, (sremErr, res) => {
        if (sremErr) return callback(sremErr, null)
        callback(null, res)
      })
    })
  }
}
