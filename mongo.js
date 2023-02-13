const mongoose = require('mongoose')

const url = process.env.MONGODB_URI //`mongodb+srv://jetsoni:jetsonimongo@cluster0.rykthl1.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

console.log('connecting to', url);
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message);
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)

// const Person = mongoose.model('Person', personSchema)

// const person = new Person({
//     name: process.argv[3],
//     number: process.argv[4],
// })

// if (process.argv.length === 3) {
//     Person.find({}).then(result => {
//         console.log('phonebook:');
//         result.forEach(person => {
//             console.log(person.name, person.number);
//         })
//         mongoose.connection.close()
//     })
// } else {
//     person.save().then(result => {
//         console.log(`added ${person.name} number ${person.number} to phonebook`)
//         mongoose.connection.close()
//     })
// }