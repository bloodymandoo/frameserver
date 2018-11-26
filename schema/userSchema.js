const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name:String,
  email:String,
  passord:String
})

module.exports = userSchema