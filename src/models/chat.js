const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
	room: String,
	conversation: [],
})

const Chat = mongoose.model('chats', chatSchema)

module.exports = Chat
