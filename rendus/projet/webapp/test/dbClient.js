const { expect } = require('chai')

describe('Redis', () => {
  let db

  before(() => {
    db = require('../src/dbClient')
  })

  it('should connect to Redis', () => {
    expect(db.connected).to.eql(true)
  })
})
