const express =require('express')
const { register, login } = require('../controllers/user')
const { verifyTokenAndAdmin } = require('../../middleware/auth')

const router =express.Router()

router.route('/register').post(verifyTokenAndAdmin,register)
router.route('/login').post(login)

module.exports = router