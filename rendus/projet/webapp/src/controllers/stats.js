const db = require('../dbClient')
const { COMMENTS_KEY, USERS_INDEX, CV_VIEWS_KEY } = require('../constants')

module.exports = {
  get: (callback) => {
    db.get(CV_VIEWS_KEY, (errViews, views) => {
      if (errViews) return callback(errViews, null)

      db.llen(COMMENTS_KEY, (errComments, commentCount) => {
        if (errComments) return callback(errComments, null)

        db.scard(USERS_INDEX, (errUsers, userCount) => {
          if (errUsers) return callback(errUsers, null)
          callback(null, {
            cvViews: parseInt(views || '0', 10),
            comments: commentCount || 0,
            users: userCount || 0
          })
        })
      })
    })
  }
}
