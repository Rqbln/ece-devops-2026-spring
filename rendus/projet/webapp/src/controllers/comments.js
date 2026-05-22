const db = require('../dbClient')
const { COMMENTS_KEY } = require('../constants')

module.exports = {
  list: (callback) => {
    db.lrange(COMMENTS_KEY, 0, -1, (err, items) => {
      if (err) return callback(err, null)
      const comments = (items || []).map((item) => JSON.parse(item))
      callback(null, comments)
    })
  },
  add: (comment, callback) => {
    if (!comment.author || !comment.text) {
      return callback(new Error('Wrong comment parameters'), null)
    }

    const payload = JSON.stringify({
      author: comment.author,
      text: comment.text,
      createdAt: new Date().toISOString()
    })

    db.rpush(COMMENTS_KEY, payload, (err, res) => {
      if (err) return callback(err, null)
      callback(null, res)
    })
  }
}
