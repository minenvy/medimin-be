const userDb = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class AuthController {
	async register(req, res) {
		console.log('register')
		const {username, email, password} = req.body.user

		const foundUser = await userDb.find({email})
		if (foundUser.length > 0) return res.json({message: 'user already exists!'})

		try {
			// const hashPw = await bcrypt.hash(password, 10)
			const newUser = new userDb({
				username,
				email,
				password,
			})
			await newUser.save()

			const token = jwt.sign({email: email}, process.env.ACCESS_TOKEN_SECRET)
			res.json({token})
		} catch (err) {
			console.log(err)
			res.sendStatus(500)
		}
	}

	async login(req, res) {
		console.log('login')
		const {email, password} = req.body.user
		console.log(email, password)

		const foundUser = await userDb.find({email})
		if (foundUser.length === 0) return res.json({message: 'no user found!'})

		// const match = await bcrypt.compare(password, foundUser[0].password)
		const match = password === foundUser[0].password
		if (!match) return res.json({message: 'password is in correct!'})

		const token = jwt.sign({email: email}, process.env.ACCESS_TOKEN_SECRET)
		res.json({token})
	}
}

module.exports = new AuthController()
