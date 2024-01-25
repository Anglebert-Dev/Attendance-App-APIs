const express = require('express')
const { createStudent, getStudents, deleteStudent, updateStudent } = require('../controllers/student.controller')
const { verifyTokenAndAdmin, verifyToken } = require('../../middleware/auth')

const router = express.Router()
createStudent
router
.route('/')
.post(verifyTokenAndAdmin,createStudent)
.get(verifyTokenAndAdmin,getStudents)

router
.route('/:id')
.delete(verifyTokenAndAdmin,deleteStudent)
.put(verifyTokenAndAdmin,updateStudent)


module.exports=router