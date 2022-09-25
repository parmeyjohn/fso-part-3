require('dotenv').config()
const mongoose = require('mongoose')


const password = process.argv[2]
const name = process.argv[3]
const number = Number(process.argv[4])

const url = process.env.MONGODB_URI

const schema = new mongoose.Schema({
    name: String,
    number: Number
})

const Person = mongoose.model('Person', schema)


mongoose.connect(url).then((res) => {
    console.log('connected')

    const person = new Person({
        name: name,
        number: number
    })

    return person.save()
})