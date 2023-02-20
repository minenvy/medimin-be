const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')

router.post('/get', userController.get)
router.post('/change-info', userController.changeInfo)
router.post('/follow', userController.follow)
router.post('/get-by-name', userController.getUserByName)

module.exports = router
