var redis = require("redis");
const configure = require('./configure')

// Base configuration from JSON files (and optional custom overrides)
const baseConfig = configure()

// Allow overriding Redis host/port via environment variables,
// so that CI/CD can point to the Docker service instead of localhost.
const redisHost = process.env.REDIS_HOST || baseConfig.redis.host
const redisPort = process.env.REDIS_PORT
  ? parseInt(process.env.REDIS_PORT, 10)
  : baseConfig.redis.port

var db = redis.createClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: () => {
    return new Error("Retry time exhausted")
  }
})

process.on('SIGINT', function() {
  db.quit();
});

module.exports = db
