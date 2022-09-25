require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('build'))


app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    }).catch(err => {
        console.log(err)
        return next(err)
    })

    
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        const date = new Date()
        response.write(`<p>Phonebook has info for ${persons.length} people.</p>`)
        response.write(`<p>${date}</p>`)
        response.end()
    })

})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.deleteOne({id: req.params.id})
    .then(() => res.status(204).end())
    .catch(err => {
        console.log(err)
        return next(err)
    })    
})

app.post('/api/persons', (req, res, next) => {
    const person = req.body
    console.log(person)
    if (!person.name) {
        return res.status(400).json({error: 'name missing'})
    } else if (!person.number) {
        return res.status(400).json({error: 'number missing'})
    }
    
    const new_person = new Person({
        name: person.name,
        number: person.number,

    })
    
    new_person.save()
    .then(p => res.json(p))
    .catch(err => next(err))
})

const errorHandler = (err, req, res, next) => {
    console.error(err.message)

    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id'})
    } else if (err.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    }

    next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
