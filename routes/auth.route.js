const express = require('express')
const authController = require('../controllers/auth.controller')

const router = express.Router()

router.post('/register', authController.register)
router.post('/verify', authController.verify)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.get('/check-auth', authController.getUser)
router.post('/resend-code', authController.resendCode)

module.exports = router