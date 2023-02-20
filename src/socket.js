const {Server} = require('socket.io')
const chatDb = require('./models/chat')
const userDb = require('./models/user')

function sockets(server) {
	const socketIds = []

	const io = new Server(server, {
		cors: {
			origin: '*',
			methods: ['GET', 'POST'],
		},
	})
	io.on('connection', (socket) => {
		socket.on('connect to server', (data) => {
			console.log('connect', data)
			socketIds[data.email] = socket.id
		})

		socket.on('join room', (data) => {
			console.log('join room', data.room)
			socket.join(data.room)
		})

		socket.on('send message', async (data) => {
			console.log('message')
			console.log(data)

			const sender = await userDb.findOne({email: data.senderMail})
			const receiver = await userDb.findOne({email: data.receiverMail})
			if (!sender?.chattedWith) sender.chattedWith = []
			if (!sender?.chattedWith.includes(data.receiverMail))
				sender.chattedWith.push(data.receiverMail)
			if (!receiver?.chattedWith) receiver.chattedWith = []
			if (!receiver?.chattedWith.includes(data.senderMail))
				receiver.chattedWith.push(data.senderMail)
			await sender.save()
			await receiver.save()

			const message = {
				email: data.senderMail,
				content: data.content,
			}
			const chat = await chatDb.findOne({room: data.room})
			if (!chat) {
				const newChat = new chatDb({
					room: data.room,
					conversation: [message],
				})
				await newChat.save()
			} else {
				chat.conversation = chat?.conversation
					? [...chat.conversation, message]
					: [message]
				await chat.save()
			}

			io.in(data.room).emit('receive message', message)
			io.to(socketIds[data.receiverMail]).emit('have notification', {
				senderMail: data.senderMail,
			})
		})
	})
}

module.exports = sockets
