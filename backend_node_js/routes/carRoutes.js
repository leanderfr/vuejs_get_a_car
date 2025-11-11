
const express = require('express')

const carController = require('../controllers/carController')

const router = express.Router()

//const { Router } = require('express')

//router.post('/', carsController.criar)


//router.get('/cars/:id', carsController.listar)
router.get('/cars', (req, res) => {


  const listar = carController.listar()
  listar
    .then((cars) => res.status(200).json(cars))
    .catch((error) => res.status(400).json(error.message))

})

module.exports = router;


