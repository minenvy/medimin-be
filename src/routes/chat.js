const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chat')

router.post('/get-all', chatController.getAll)
router.post('/add', chatController.add)

module.exports = router
