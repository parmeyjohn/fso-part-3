const mongoose = require('mongoose')

url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to mongoDB')
    })
    .catch(error => {
        console.log('error connecting to mongoDB:', error.message)
    })


const PersonSchema = new mongoose.Schema({
    name: String,
    number: String
})

//the schema constructor automatically creates a version member variable and id object,
// we need to change that to a regular string id

PersonSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = document._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports = mongoose.model('Person', PersonSchema)