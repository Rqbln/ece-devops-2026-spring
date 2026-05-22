const redis = require('redis')
const configure = require('./configure')

const baseConfig = configure()
const redisHost = process.env.REDIS_HOST || baseConfig.redis.host
const redisPort = process.env.REDIS_PORT
  ? parseInt(process.env.REDIS_PORT, 10)
  : baseConfig.redis.port

const db = redis.createClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: () => new Error('Retry time exhausted')
})

process.on('SIGINT', () => {
  db.quit()
})

module.exports = db
