const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mynzhasardimash:Saharnii@cluster0.3eo4pgp.mongodb.net/we')
.then(() => {
        console.log('db connection')
    }).catch((err) =>{
        console.log('error connecting to db', err )
    })

const LoginSchema = new mongoose.Schema({
    name:{
        type: 'string',
        required: true,
    },
    password:{
        type: 'string',
        required: true,
    }
})

const collection = new mongoose.model("users",LoginSchema)

module.exports = collection;