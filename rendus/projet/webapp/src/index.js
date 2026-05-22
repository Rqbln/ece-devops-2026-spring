const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const userRouter = require('./routes/user')
const commentsRouter = require('./routes/comments')
const statsRouter = require('./routes/stats')
const cvPage = require('./views/cvPage')
const db = require('./dbClient')
const { CV_VIEWS_KEY } = require('./constants')

const app = express()
const port = process.env.PORT || 3000

const profile = {
  title: 'CV DevOps — Romain Martin',
  name: 'Romain Martin',
  role: 'Étudiant Ingénieur — Spécialité DevOps & Cloud',
  email: 'romain.martin@ece.fr',
  phone: '+33 6 12 34 56 78',
  location: 'Paris, France',
  github: 'https://github.com/Rqbln',
  linkedin: 'https://linkedin.com/in/romain-martin-devops',
  summary:
    'Étudiant à ECE Paris, passionné par l’automatisation, les pipelines CI/CD, l’Infrastructure as Code et l’orchestration de conteneurs. Ce projet regroupe l’ensemble des compétences acquises durant le cours DevOps.',
  skills: [
    'Node.js',
    'Express',
    'Redis',
    'Docker',
    'Kubernetes',
    'Ansible',
    'Vagrant',
    'GitHub Actions',
    'GitLab CI',
    'Minikube'
  ],
  experiences: [
    {
      title: 'Projet DevOps — Application CV',
      company: 'ECE Paris',
      period: '2025 – 2026',
      description:
        'Conception d’une webapp, pipeline CI/CD, provisioning Ansible, image Docker Hub et déploiement Kubernetes.'
    },
    {
      title: 'TP Continuous Testing',
      company: 'ECE Paris',
      period: '2025',
      description: 'API REST Node.js, tests Mocha/Chai, intégration Redis.'
    },
    {
      title: 'TP Container Orchestration',
      company: 'ECE Paris',
      period: '2025',
      description: 'Déploiements et services Kubernetes avec Minikube.'
    }
  ],
  education: [
    {
      degree: 'Cycle Ingénieur — Informatique',
      school: 'ECE Paris',
      year: '2026'
    },
    {
      degree: 'Prépa intégrée',
      school: 'ECE Paris',
      year: '2023'
    }
  ],
  languages: ['Français (natif)', 'Anglais (B2)', 'Espagnol (A2)']
}

const openApiSpec = YAML.load(path.join(__dirname, '../conf/openapi.yaml'))

db.on('error', (err) => {
  console.error('Redis error:', err.message)
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec))

app.get('/health', (req, res) => {
  if (!db.connected) {
    return res.status(503).json({
      status: 'error',
      app: 'up',
      redis: false,
      message: 'Redis is not connected'
    })
  }

  db.ping((err) => {
    if (err) {
      return res.status(503).json({
        status: 'error',
        app: 'up',
        redis: false,
        message: err.message
      })
    }
    return res.status(200).json({
      status: 'ok',
      app: 'up',
      redis: true,
      version: '1.0.0',
      uptime: process.uptime()
    })
  })
})

app.get('/', (req, res) => {
  const render = (views) => {
    res.status(200).send(cvPage(profile, views))
  }

  if (!db.connected) {
    return render('N/A')
  }

  db.incr(CV_VIEWS_KEY, (err, views) => {
    if (err) return render('N/A')
    return render(views)
  })
})

app.use('/user', userRouter)
app.use('/comments', commentsRouter)
app.use('/api/stats', statsRouter)

const server = app.listen(port, (err) => {
  if (err) throw err
  console.log('Server listening on port ' + port)
  console.log('Swagger UI: http://localhost:' + port + '/api-docs')
})

module.exports = server
