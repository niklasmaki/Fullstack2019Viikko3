const mongoose = require('mongoose')

if ( process.argv.length < 3 || process.argv.length == 4 ) {
  console.log('Usage: node mongo.js <password>')
  console.log('OR     node mongo.js <password> <name> <number>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb://niklas:${password}@ds121295.mlab.com:21295/puhelinluettelo`

mongoose.connect(url, { useNewUrlParser: true })
  .catch(e => console.log(e))

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})


const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({})
  .then(result => {
    console.log("Puhelinluettelo: ")
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    
    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  person.save().then(response => {
    console.log(`Lisätään ${person.name} numero ${person.number} luetteloon.`)
    mongoose.connection.close()
  })
}
