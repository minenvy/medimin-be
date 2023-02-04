const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
	title: String,
	description: String,
	createdAt: Date,
	updatedAt: Date,
	tagList: [String],
	favorited: [String],
	image: String,
	author: String,
})

const Article = mongoose.model('article', articleSchema)

module.exports = Article
