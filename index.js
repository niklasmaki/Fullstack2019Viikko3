const express = require('express')

const app = express()

const persons = 
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

app.get('/info', (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8")
  res.write(`<div>Puhelinluettelossa ${persons.length} henkilön tiedot</div>`)
  res.write(`<div>${Date().toString()}</div>`)
  res.end()
})

const PORT = 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))