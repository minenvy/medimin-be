const commentDb = require('../models/comment')
const userDb = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()

class Comment {
	async getById(req, res) {
		console.log('get comment by id')
		const {_id} = req.body

		let comments = await commentDb.find({post_id: _id}).sort({createdAt: -1})
		const users = await userDb.find()
		comments = comments.map((comment) => {
			const user = users.find((user) => user?.email === comment?.author)
			return {
				...comment?._doc,
				author: user,
			}
		})
		console.log(comments)

		res.status(200).send({comments})
	}

	async add(req, res) {
		console.log('add new comment')
		const {token, _id, description} = req.body

		const email = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)?.email
		const newComment = new commentDb({
			author: email,
			description,
			postId: _id,
			createdAt: new Date(),
		})
		await newComment.save()

		res.status(200).send({message: 'thanh cong'})
	}
}

module.exports = new Comment()
