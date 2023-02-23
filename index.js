require('dotenv').config()
const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')


const Person = require('./models/person')


const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

// 3.7 näyttäisi toimivan, mutta en lähtisi pitämään TED Talkia tästä
app.use(morgan('tiny'))
// 3.8* tehty onnistuneesti
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


app.get('/info', (request, response) => {
    Person.find({})
        .then(persons => {
            const dateNow = new Date().toString()
            const info = `<div>Phonebook has info for ${persons.length} people<br><br>${dateNow}</div>`
            console.log('persons:', persons, 'date now:', dateNow, 'type:', typeof dateNow);
            response.send(info)
        })
})

app.get('/api/persons', (request, response) => {
    console.log('Person:', Person);
    Person.find({})
        .then(persons => {
            console.log('persons:', persons);
            response.json(persons)
        })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
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

// 3.15. Delete-painike ei toimi frontissa, joten tätä ei pysty vielä tekemään UI:n kautta
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            next(error)
            // console.log(error)
            // response.status(400).send({ error: 'malformatted id' })
        })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: body.number })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})








app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})