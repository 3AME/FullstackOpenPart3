require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('dist'))

app.use(express.json())
app.use(cors())

morgan.token('data', function (req, res) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

app.get('/info', async (request, response) => {
    const count = await Person.countDocuments()
    console.log('count', count)
    response.send(`<div><p>Phonebook has info for ${count} people</p><br /><p>${Date()}</p></div>`)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const generateID = () => {
    const id = Math.floor(Math.random() * 1e9)
    return id
}

async function addOrUpdatePerson(name) {
    const existName = await Person.findOne({ name: name })
    // console.log('existName',existName)
    if (existName) {
        const id = existName._id
        return id
    } else {
        return null
    }
}

app.post('/api/persons', async (request, response) => {
    const body = request.body
    const name = body.name
    console.log(body.name)

    const existId = await addOrUpdatePerson(name)
    // console.log('existId', existId.toString())

    // const existName = Person.findOne({ name: `${name}` }, {_id:1})
    // console.log('exsitName',exsitName.id)
    // const existName = Person.find(person => person.name === body.name)
    // console.log('exsitName',existName)
    if (!body.name) {
        return response.status(404).json({
            error: 'name is missing'
        })
    } else if (!body.number) {
        return response.status(404).json({
            error: 'number is missing'
        })
    } 
    if (existId) {
        const id = existId.toString()
        // console.log('id', id)
        const updatedPerson = await fetch(`/api/persons/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({number: body.number})
        })
        response.json(updatedPerson)
        // return response.status(404).json({
        //     error: 'name must be unique'
        // })
    } else {
        const person = new Person({
            name: body.name,
            number: body.number,
        })
        person.save().then(savedPerson => {
            response.json(savedPerson)
        })
    }
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number,
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
        response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})