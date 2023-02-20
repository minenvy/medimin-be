const userDb = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class UserController {
	async get(req, res) {
		console.log('get user')
		const {token, authorEmail} = req.body

		const email =
			authorEmail || jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).email
		const users = await userDb.find()
		const user = users.find((user) => user?.email.includes(email))
		const chattedPeople = user?.chattedWith.map((email) => {
			const friend = users.find((user) => user.email === email)
			return {
				username: friend.username,
				email: friend.email,
				image: friend?.image,
			}
		})

		res.status(200).send({
			username: user.username,
			email,
			bio: user?.bio,
			image: user?.image,
			background: user?.background,
			following: user?.following,
			chattedWith: chattedPeople || [],
		})
	}

	async getUserByName(req, res) {
		console.log('get user by name')
		let {name} = req.body
		name = name.toLowerCase()

		if (!name) return res.status(200).send([])

		const users = await userDb.find()
		const foundUsers = users
			.filter((user) => user?.username.toLowerCase().includes(name))
			.map((user) => {
				return {
					username: user.username,
					image: user?.image,
					email: user.email,
				}
			})

		res.status(200).send(foundUsers)
	}

	async changeInfo(req, res) {
		console.log('change user info')
		const {token, image, background, username, bio, newPw, chattedPerson} =
			req.body

		const email = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).email
		if (chattedPerson) {
			const user = await userDb.findOne({email})
			if (!user?.chattedWith.includes(chattedPerson)) {
				if (user?.chattedWith.length === 0) user.chattedWith = [chattedPerson]
				else user?.chattedWith.unshift(chattedPerson)
			}
			await user.save()
		} else {
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
		}

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
