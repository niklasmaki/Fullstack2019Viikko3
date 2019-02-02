const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let persons = 
[
  {
    id: 1,
    name: "Arto Hellas",
    number: "045-1236543"
  },
  {
    id: 2,
    name: "Arto Järvinen",
    number: "041-21423123"
  },
  {
    id: 3,
    name: "Lea Kutvonen",
    number: "040-4323234"
  },
  {
    id: 4,
    name: "Martti Tienari",
    number: "09-784232"
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
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
  if (persons.find(person => person.name === body.name)) {
    return sendError(res, '409', {error: 'Name must be unique'})
  }
  const person = {
    id: Math.floor(Math.random() * 1000000),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)
  res.json(person)
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

const PORT = 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))