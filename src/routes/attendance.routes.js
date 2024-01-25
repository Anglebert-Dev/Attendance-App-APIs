const express = require('express')
const {createAttendance, getAttendanceReport} = require('../controllers/attendance.controller')
const router = express.Router()


router
.route('/')
.post(createAttendance)

router
.route('/report')
.get(getAttendanceReport)



module.exports=router