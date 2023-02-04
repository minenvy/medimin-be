const express = require('express')
const app = express()
const PORT = 8080
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const routes = require('./src/routes')

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

mongoose.set('strictQuery', true)
mongoose.connect('mongodb://localhost:27017')

routes(app)

app.listen(PORT, () => {
	console.log(`http://localhost:${PORT}`)
})
