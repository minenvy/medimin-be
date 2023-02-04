const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
	description: String,
	author: String,
	postId: String,
	createdAt: Date,
})

const Comment = mongoose.model('comment', commentSchema)

module.exports = Comment
