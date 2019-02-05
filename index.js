require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('body', req =>
  isEmptyObject(req.body) ? '' : JSON.stringify(req.body)
)

const app = express()
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res, next) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {

  Person
    .findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

const sendError = (res, status, message) => {
  res.status(status).json(message)
}

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if (!body.name) return sendError(res, '400', { error: 'Name is missing' })
  if (!body.number) return sendError(res, '400', { error: 'Number is missing' })

  // if (persons.find(person => person.name === body.name)) {
  //   return sendError(res, '409', {error: 'Name must be unique'})
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number
  }

  Person
    .findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      if (!updatedPerson) {
        res.status(404).end()
      } else {
        res.json(updatedPerson)
      }
    })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (req, res, next) => {
  Person
    .findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  Person
    .count({})
    .then(count => {
      res.setHeader("Content-Type", "text/html; charset=utf-8")
      res.write(`<div>Puhelinluettelossa ${count} henkilön tiedot</div>`)
      res.write(`<div>${Date().toString()}</div>`)
      res.end()
    })
    .catch(error => next(error))

})

const isEmptyObject = object => Object.keys(object).length === 0

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'Malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))