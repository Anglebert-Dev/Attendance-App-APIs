const express = require('express')
const { createClasses, deleteClass, updateClass, getClasses } = require('../controllers/class.controller')
const router = express.Router()

router
.route('/')
.post(createClasses)
.get(getClasses)
router
.route('/:id')
.delete(deleteClass)
.put(updateClass)


module.exports=router