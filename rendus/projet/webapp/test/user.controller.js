const { expect } = require('chai')
const userController = require('../src/controllers/user')
const db = require('../src/dbClient')

describe('User', () => {
  beforeEach(() => {
    db.flushdb()
  })

  describe('Create', () => {
    it('create a new user', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      userController.create(user, (err, result) => {
        expect(err).to.be.equal(null)
        expect(result).to.equal(1)
        done()
      })
    })

    it('passing wrong user parameters', (done) => {
      const user = {
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      userController.create(user, (err, result) => {
        expect(err).to.not.be.equal(null)
        expect(result).to.be.equal(null)
        done()
      })
    })

    it('avoid creating an existing user', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      userController.create(user, (err) => {
        expect(err).to.be.equal(null)
        userController.create(user, (errDuplicate, result) => {
          expect(errDuplicate).to.not.be.equal(null)
          expect(errDuplicate.message).to.equal('User already exists')
          expect(result).to.be.equal(null)
          done()
        })
      })
    })
  })

  describe('Get', () => {
    it('get a user by username', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      userController.create(user, (err) => {
        expect(err).to.be.equal(null)
        userController.get(user.username, (errGet, userResult) => {
          expect(errGet).to.be.equal(null)
          expect(userResult).to.deep.equal({
            firstname: user.firstname,
            lastname: user.lastname
          })
          done()
        })
      })
    })

    it('cannot get a user when it does not exist', (done) => {
      userController.get('unknown', (err, userResult) => {
        expect(err).to.not.be.equal(null)
        expect(userResult).to.be.equal(null)
        done()
      })
    })
  })

  describe('List / Update / Delete', () => {
    it('lists, updates and deletes users', (done) => {
      userController.create({ username: 'alice', firstname: 'A', lastname: 'B' }, () => {
        userController.list((err, users) => {
          expect(users).to.include('alice')
          userController.update('alice', { lastname: 'Z' }, () => {
            userController.get('alice', (e, u) => {
              expect(u.lastname).to.equal('Z')
              userController.remove('alice', () => {
                userController.get('alice', (e2) => {
                  expect(e2).to.not.be.equal(null)
                  done()
                })
              })
            })
          })
        })
      })
    })
  })
})
