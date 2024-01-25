const express = require('express')
const { createClasses, deleteClass, updateClass, getClasses } = require('../controllers/class.controller')
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('../../middleware/auth')
const router = express.Router()

router
.route('/')
.post(verifyTokenAndAdmin,createClasses)
.get(verifyTokenAndAdmin,getClasses)
router
.route('/:id')
.delete(verifyTokenAndAdmin,deleteClass)
.put(verifyTokenAndAdmin,updateClass)


module.exports=router