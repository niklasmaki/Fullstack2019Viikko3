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

app.get('/api/persons', (req, res) => {
  Person 
    .find({})
    .then(persons => {
      res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (!person) return res.status('404').end()
  res.json(person)
})

const sendError = (res, status, message) => {
  res.status(status).json(message)
}

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body.name) return sendError(res, '400', {error: 'Name is missing'})
  if (!body.number) return sendError(res, '400', {error: 'Number is missing'})
  
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
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.get('/info', (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8")
  res.write(`<div>Puhelinluettelossa ${persons.length} henkilön tiedot</div>`)
  res.write(`<div>${Date().toString()}</div>`)
  res.end()
})

const isEmptyObject = object => Object.keys(object).length === 0

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))