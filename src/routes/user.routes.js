const express =require('express')
const { register, login, verifyEmail } = require('../controllers/user')
const { verifyTokenAndAdmin } = require('../../middleware/auth')

const router =express.Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/verify-email/:verificationCode').get(verifyEmail)

module.exports = router