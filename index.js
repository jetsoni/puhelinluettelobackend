// Nyt muuttujan persons määrittelynä tyhjä let persons = []. Voiko tehdä paremmin?
require('dotenv').config()
const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')


const Person = require('./models/person')

let persons = []

// 3.7 näyttäisi toimivan, mutta en lähtisi pitämään TED Talkia tästä
app.use(morgan('tiny'))
// 3.8* tehty onnistuneesti
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
    console.log('Person:', Person);
    Person.find({}).then(persons => {
        console.log('persons:', persons);
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

// 3.2: puhelinluettelon backend step2; tää timestamp on vähän työmaa mut nyt toimii yksinkertanen versio
const dateNow = (new Date().toLocaleString())
const info = `<div>Phonebook has info for ${persons.length} people<br><br>${dateNow}</div>`
app.get('/info', (req, res) => {
    console.log('date now:', dateNow, 'type:', typeof dateNow);
    res.send(info)
})


app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
        return response.status(400).json({ error: 'name not given' })
    }
    if (!body.number) {
        return response.status(400).json({ error: 'number not given' })
    }
    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})