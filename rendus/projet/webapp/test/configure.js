const { expect } = require('chai')
const configure = require('../src/configure')

describe('Configure', () => {
  it('load default json configuration file', () => {
    const config = configure()
    expect(config.redis).to.eql({ host: '127.0.0.1', port: 6379 })
    expect(config.app.title).to.equal('CV DevOps')
  })

  it('load custom configuration', () => {
    const config_custom = { custom: 'value' }
    const config = configure(config_custom)
    expect(config).to.eql({
      redis: { host: '127.0.0.1', port: 6379 },
      app: { title: 'CV DevOps' },
      custom: 'value'
    })
  })
})
