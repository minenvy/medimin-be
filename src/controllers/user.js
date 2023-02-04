const userDb = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class UserController {
	async get(req, res) {
		console.log('get user')
		const {token, authorEmail} = req.body

		const email =
			authorEmail || jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).email
		const user = await userDb.findOne({email})

		res.status(200).send({
			username: user?.username,
			email,
			bio: user?.bio,
			image: user?.image,
			background: user?.background,
			following: user?.following,
		})
	}

	async changeInfo(req, res) {
		console.log('change user info')
		const {token, image, background, username, bio, newPw} = req.body

		const email = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).email
		await userDb.findOneAndUpdate(
			{email},
			{
				image,
				background,
				username,
				bio,
				password: await bcrypt.hash(newPw, 10),
			}
		)
		res.status(200).send({message: 'thanh cong'})
	}

	async follow(req, res) {
		console.log('follow / unfollow')
		const {followingEmail, followedEmail} = req.body
		const followingUser = await userDb.findOne({email: followingEmail})

		if (followingUser?.following.includes(followedEmail)) {
			const following = followingUser?.following.filter(
				(email) => email !== followedEmail
			)

			followingUser.following = following
			await followingUser.save()

			res.status(200).send({message: 'unfollow'})
		} else {
			const following = followingUser?.following
			following.push(followedEmail)

			followingUser.following = following
			await followingUser.save()

			res.status(200).send({message: 'follow'})
		}
	}
}

module.exports = new UserController()
