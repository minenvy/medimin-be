const express = require('express')
const app = express()
const PORT = 8080
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const http = require('http')
const routes = require('./src/routes')
const sockets = require('./src/socket')

app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb', extended: true}))
app.use(cors())

mongoose.set('strictQuery', true)
mongoose.connect('mongodb://localhost:27017')

routes(app)

const server = http.createServer(app)

sockets(server)

server.listen(PORT, () => {
	console.log(`http://localhost:${PORT}`)
})

module.exports = server
