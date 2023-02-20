const chatDb = require('../models/chat')

class ChatController {
	async getAll(req, res) {
		const {_id} = req.body

		const chat = await chatDb.findOne({room: _id})

		res.status(200).send({messages: chat?.conversation})
	}

	async add(req, res) {
		const {senderMail, receiverMail, content} = req.body

		const chatRoom = [senderMail, receiverMail].sort().toString()
		const chat = await chatDb.findOne({room: chatRoom})
		chat.conversation = [
			...chat.conversation,
			{
				email: senderMail,
				content,
			},
		]
		await chat.save()

		res.status(200)
	}
}

module.exports = new ChatController()
