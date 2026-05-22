const app = require('../src/index')
const chai = require('chai')
const chaiHttp = require('chai-http')
const db = require('../src/dbClient')

chai.use(chaiHttp)

describe('Application API', () => {
  beforeEach(() => {
    db.flushdb()
  })

  after(() => {
    app.close()
    db.quit()
  })

  it('GET / displays CV content', (done) => {
    chai.request(app)
      .get('/')
      .then((res) => {
        chai.expect(res).to.have.status(200)
        chai.expect(res.text).to.include('CV DevOps')
        chai.expect(res.text).to.include('Compétences')
        done()
      })
      .catch((err) => {
        throw err
      })
  })

  it('GET /health returns ok when redis is connected', (done) => {
    chai.request(app)
      .get('/health')
      .then((res) => {
        chai.expect(res).to.have.status(200)
        chai.expect(res.body.status).to.equal('ok')
        chai.expect(res.body.redis).to.equal(true)
        done()
      })
      .catch((err) => {
        throw err
      })
  })

  it('POST and GET /comments work', (done) => {
    chai.request(app)
      .post('/comments')
      .send({ author: 'Alice', text: 'Super CV !' })
      .then((postRes) => {
        chai.expect(postRes).to.have.status(201)
        return chai.request(app).get('/comments')
      })
      .then((getRes) => {
        chai.expect(getRes).to.have.status(200)
        chai.expect(getRes.body.comments).to.have.length(1)
        chai.expect(getRes.body.comments[0].author).to.equal('Alice')
        done()
      })
      .catch((err) => {
        throw err
      })
  })

  describe('POST /user', () => {
    it('create a new user', (done) => {
      chai.request(app)
        .post('/user')
        .send({
          username: 'sergkudinov',
          firstname: 'Sergei',
          lastname: 'Kudinov'
        })
        .then((res) => {
          chai.expect(res).to.have.status(201)
          chai.expect(res.body.status).to.equal('success')
          done()
        })
        .catch((err) => {
          throw err
        })
    })

    it('pass wrong parameters', (done) => {
      chai.request(app)
        .post('/user')
        .send({ firstname: 'Sergei', lastname: 'Kudinov' })
        .then((res) => {
          chai.expect(res).to.have.status(400)
          chai.expect(res.body.status).to.equal('error')
          done()
        })
        .catch((err) => {
          throw err
        })
    })
  })

  describe('GET /user', () => {
    it('successfully get user', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      db.hmset(user.username, { firstname: user.firstname, lastname: user.lastname }, (err) => {
        if (err) throw err
        chai.request(app)
          .get(`/user/${user.username}`)
          .then((res) => {
            chai.expect(res).to.have.status(200)
            chai.expect(res.body.status).to.equal('success')
            chai.expect(res.body.user.username).to.equal(user.username)
            done()
          })
          .catch((errGet) => {
            throw errGet
          })
      })
    })

    it('cannot get a user when it does not exist', (done) => {
      chai.request(app)
        .get('/user/unknown')
        .then((res) => {
          chai.expect(res).to.have.status(404)
          chai.expect(res.body.status).to.equal('error')
          done()
        })
        .catch((err) => {
          throw err
        })
    })

    it('DELETE /user/:username removes user', (done) => {
      chai.request(app)
        .post('/user')
        .send({ username: 'todelete', firstname: 'X', lastname: 'Y' })
        .then(() => chai.request(app).delete('/user/todelete'))
        .then((res) => {
          chai.expect(res).to.have.status(200)
          return chai.request(app).get('/user/todelete')
        })
        .then((res) => {
          chai.expect(res).to.have.status(404)
          done()
        })
        .catch((err) => {
          throw err
        })
    })
  })

  it('GET /api/stats returns counters', (done) => {
    chai.request(app)
      .get('/api/stats')
      .then((res) => {
        chai.expect(res).to.have.status(200)
        chai.expect(res.body.stats).to.have.keys(['cvViews', 'comments', 'users'])
        done()
      })
      .catch((err) => {
        throw err
      })
  })

  it('GET /api-docs serves Swagger UI', (done) => {
    chai.request(app)
      .get('/api-docs/')
      .then((res) => {
        chai.expect(res).to.have.status(200)
        chai.expect(res.text).to.include('swagger')
        done()
      })
      .catch((err) => {
        throw err
      })
  })
})
