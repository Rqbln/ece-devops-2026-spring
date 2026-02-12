const db = require('../dbClient')

module.exports = {
  create: (user, callback) => {
    // Check parameters
    if(!user.username)
      return callback(new Error("Wrong user parameters"), null)
    // Create User schema
    const userObj = {
      firstname: user.firstname,
      lastname: user.lastname,
    }
    // Save to DB
    // TODO check if user already exists
    db.hmset(user.username, userObj, (err, res) => {
      if (err) return callback(err, null)
      callback(null, res) // Return callback
    })
  },
  get: (username, callback) => {
    // Check parameters
    if (!username) {
      return callback(new Error('Wrong user parameters'), null)
    }
    // Read from DB
    db.hgetall(username, (err, user) => {
      if (err) return callback(err, null)
      if (!user) return callback(new Error('User does not exist'), null)
      callback(null, user)
    })
  }
}
