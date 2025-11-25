
const express = require('express')

const carController = require('../controllers/carController')

const router = express.Router()

// optional searchbox came
router.get('/list/:active/:searchbox', carController.getAll)  

// no searchbox
router.get('/list/:active', carController.getAll)  

module.exports = router


