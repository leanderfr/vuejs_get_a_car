
const express = require('express')

const expressionController = require('../controllers/expressionController')

const router = express.Router()

// resultformat =>  json , returns as an array of json, reference, returns as a simple keyed array,  expressions.tablename, expresssions.title, etc
// optional searchbox came
router.get('/list/:resultformat/:country/:active/:searchbox', expressionController.getByCountry)

// no searchbox
router.get('/list/:resultformat/:country/:active', expressionController.getByCountry)

router.get('/:id', expressionController.getById)



//router.get('/:id', expressionController.getById)

  

module.exports = router


