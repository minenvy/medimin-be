const express = require('express')
const router = express.Router()
const articleController = require('../controllers/article')

router.post('/get', articleController.get)
router.post('/get-by-id', articleController.getById)
router.post('/add', articleController.add)
router.post('/update', articleController.update)
router.post('/delete', articleController.delete)
router.post('/like', articleController.like)

module.exports = router
