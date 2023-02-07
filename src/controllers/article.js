const articleDb = require('../models/article')
const userDb = require('../models/user')
const commentDb = require('../models/comment')
const jwt = require('jsonwebtoken')

class ArticleController {
	async get(_, res) {
		console.log('get article')
		let allArticles = await articleDb.find().sort({createdAt: -1})
		const users = await userDb.find()
		allArticles = allArticles.map((article) => {
			const author = users.find((user) => user.email === article.author)
			return {...article._doc, author: author, _id: article._id}
		})
		res.status(200).send({articles: allArticles})
	}

	async getById(req, res) {
		console.log('get article by id')
		const {_id} = req.body
		console.log(_id)

		if (!_id) return res.status(200).send({})

		const article = await articleDb.findById(_id)
		const users = await userDb.find()
		const user = users.find((user) => user?.email === article?.author)
		let comments = await commentDb.find({post_id: _id})
		comments = comments.map((comment) => {
			const author = users.find((user) => user.email === comment.author)
			return {...comment._doc, author: author, _id: comment._id}
		})
		res
			.status(200)
			.send({...article?._doc, author: user, _id: article?._id, comments})
	}

	async add(req, res) {
		console.log('add article')
		const {title, description, image, tagList, token} = req.body
		const email = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).email

		const article = new articleDb({
			title,
			description,
			createdAt: new Date(),
			updatedAt: null,
			tagList,
			favorited: [],
			image,
			author: email,
		})
		article.save()

		res.status(200).send({message: 'thanh cong'})
	}

	async update(req, res) {
		console.log('update article')
		const {title, description, image, tagList, _id} = req.body

		await articleDb.findByIdAndUpdate(_id, {
			title,
			description,
			updatedAt: new Date(),
			tagList,
			image,
		})

		res.status(200).send({message: 'thanh cong'})
	}

	async delete(req, res) {
		console.log('delete article')
		const {_id} = req.body
		await articleDb.findByIdAndDelete(_id)
		res.status(200).send({message: 'thanh cong'})
	}

	async like(req, res) {
		console.log('like article')
		const {_id, email} = req.body

		const article = await articleDb.findById(_id)
		if (!article?.favorited || article?.favorited.length) {
			article.favorited = [email]
		}
		if (article?.favorited.includes(email)) {
			article.favorited = article.favorited.filter(
				(authorEmail) => authorEmail !== email
			)
		} else {
			article?.favorited.push(email)
		}

		await article.save()
		res.status(200).send({message: 'thanh cong'})
	}
}

module.exports = new ArticleController()
