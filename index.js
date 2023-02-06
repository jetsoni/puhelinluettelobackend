const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "044-4445555"
    },
    {
        id: 2,
        name: "Same Sonni",
        number: "050-5142998"
    },
    {
        id: 3,
        name: "Jone Tsonsson",
        number: "040-2015002"
    },
    {
        id: 4,
        name: "Mäte Sonnius",
        number: "050-2345678"
    }
]

// 3.7 näyttäisi toimivan, mutta en lähtisi pitämään TED Talkia tästä
app.use(morgan('tiny'))
// 3.8* tehty onnistuneesti
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('<h1>hello world</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

// 3.2: puhelinluettelon backend step2; tää timestamp on vähän työmaa mut nyt toimii yksinkertanen versio
const dateNow = (new Date().toLocaleString())
const info = `<div>Phonebook has info for ${persons.length} people<br><br>${dateNow}</div>`
app.get('/info', (req, res) => {
    console.log('date now:', dateNow, 'type:', typeof dateNow);
    res.send(info)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log('id:', id);
    const person = persons.find(person => person.id === id)
    console.log('person:', person);

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(omakeksima => omakeksima.id !== id)
    res.status(204).end()
})



app.post('/api/persons', (req, res) => {
    const randomId = Math.floor(Math.random() * (1000000 - 0) + 0)

    const person = req.body
    person.id = randomId
    const namesAsList = persons.map(person => person.name)


    console.log('person:', person);
    if (!person.name) {
        // res.status(400)
        // console.log('Name not given');
        // const error = new Error("name not given")
        // throw error;
        return res.status(400).send({ error: 'name not given' })
    }

    if (!person.number) {
        // console.log('Number not given');
        // const error = new Error("number not given")
        // throw error;
        return res.status(400).send({ error: 'number not given' })
    }

    if (namesAsList.includes(person.name)) {
        // console.log('Name must be unique');
        // const error = new Error("name must be unique")
        // throw error;
        return res.status(400).send({ error: 'name must be unique' })
    }

    else {
        persons = persons.concat(person)
        res.json(person)
    }

    // if (person.name && person.number && !(namesAsList.includes(person.name))) {

    //     console.log('person.name', person.name, typeof person.name);
    //     console.log('namesAsList[0]:', namesAsList[0], typeof namesAsList[0]);
    //     console.log('namesAsList:', namesAsList);
    //     console.log('ehtolause:', !(namesAsList.includes(person.name)));

    //     persons = persons.concat(person)
    //     res.json(person)


    //     console.log('lisätty');
    // } else {
    //     console.log('person.name:', person.name);

    //     console.log('namesAsList:', namesAsList);
    //     console.log('ehtolause:', !(namesAsList.includes(person.name)));
    //     console.log('error: nimi jo listalla tai nimi/numero on tyhjä');
    // }


})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})