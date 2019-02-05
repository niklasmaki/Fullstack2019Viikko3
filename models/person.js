const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('Connecting to', url);

mongoose.connect(url, { useNewUrlParser: true })
  .then(result => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log('Error connecting to MongoDB', error.message);
  })


const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

module.exports = mongoose.model('Person', personSchema)

