const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    
    fullname: String,

    email: {
        type: String,
        unique: true
    },

    verified: {
        type: Boolean,
        default: false
    }

})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel