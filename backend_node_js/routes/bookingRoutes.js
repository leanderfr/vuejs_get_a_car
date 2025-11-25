
const express = require('express')

const bookingController = require('../controllers/bookingController')

const bookingRouter = express.Router()

// it needs the country to return dates in the format used by the given country (Brazil or EUA)
bookingRouter.get('/list/:country/:car_id/:firstday/:lastday', bookingController.getByCar)  

//bookingRouter.get('/:id', bookingController.getById)

module.exports =  bookingRouter


