const express = require('express')
var morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    response.send(`<div><p>Phonebook has info for ${persons.length} people</p><br /><p>${Date()}</p></div>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const generateID = () => {
    const id = Math.floor(Math.random() * 1e9)
    return id
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body.name)
    const existName = persons.find(person=>person.name === body.name)
    if(!body.name){
        return response.status(404).json({
            error:'name is missing'
        })
    } else if(!body.number){
        return response.status(404).json({
            error:'number is missing'
        })
    } else if(existName){
        return response.status(404).json({
            error:'name must be unique'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: `${generateID()}`
    }
    persons= persons.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT)