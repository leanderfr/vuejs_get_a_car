
const express = require('express')

const carController = require('../controllers/carController')

const carRouter = express.Router()

// optional searchbox came
carRouter.get('/list/:active/:searchbox', carController.getAll)  

// no searchbox
carRouter.get('/list/:active', carController.getAll)  

carRouter.get('/:id', carController.getById)

module.exports = carRouter


