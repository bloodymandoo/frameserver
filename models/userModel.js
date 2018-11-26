const mongoose = require('mongoose')
const userSchema = require('../schema/userSchema.js')

module.exports = mongoose.model('user',userSchema)