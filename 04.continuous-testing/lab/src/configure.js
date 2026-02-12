const mixme = require('mixme')
const config_default = require('../conf/default')

// Keep this function pure and deterministic for tests: it only merges
// the default JSON config with an optional custom object.
// Environment-specific overrides are handled in dbClient.js instead.
module.exports = (config_custom = {}) => {
  const config = mixme.merge(config_default, config_custom)
  return config
}
