const authRouter = require('./auth')
const articleRouter = require('./article')
const userRouter = require('./user')
const commentRouter = require('./comment')

function routes(app) {
	app.use('/auth', authRouter)
	app.use('/article', articleRouter)
	app.use('/user', userRouter)
	app.use('/comment', commentRouter)
}

module.exports = routes
