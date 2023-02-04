const express = require('express')
const router = express.Router()
const commentController = require('../controllers/comment')

router.post('/get-by-id', commentController.getById)
router.post('/add', commentController.add)

module.exports = router
