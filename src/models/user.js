const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
	bio: String,
	image: String,
	background: String,
	following: [],
	chattedWith: [],
})

const User = mongoose.model('user', userSchema)

module.exports = User
