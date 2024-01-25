const express = require('express')
const {createAttendance, getAttendanceReport} = require('../controllers/attendance.controller')
const { verifyTokenAndAdmin } = require('../../middleware/auth')
const router = express.Router()


router
.route('/')
.post(verifyTokenAndAdmin,createAttendance)

router
.route('/report')
.get(verifyTokenAndAdmin,getAttendanceReport)



module.exports=router