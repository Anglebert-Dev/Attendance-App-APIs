const express = require('express')
const { createStudent, getStudents, deleteStudent, updateStudent } = require('../controllers/student.controller')

const router = express.Router()
createStudent
router
.route('/')
.post(createStudent)
.get(getStudents)

router
.route('/:id')
.delete(deleteStudent)
.put(updateStudent)


module.exports=router