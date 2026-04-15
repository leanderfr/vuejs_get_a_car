
import express from 'express'

import * as expressionController from '../controllers/expressionController.ts'

const expressionRouter = express.Router()

// resultformat =>  json , returns as an array of json, reference, returns as a simple keyed array,  expressions.tablename, expresssions.title, etc
// optional searchbox came
expressionRouter.get('/list/:resultformat/:country/:active/:searchbox', expressionController.getByCountry)

// no searchbox
expressionRouter.get('/list/:resultformat/:country/:active', expressionController.getByCountry)

expressionRouter.get('/:id', expressionController.getById)

expressionRouter.post('/:id', expressionController.update)



//router.get('/:id', expressionController.getById)

  

export default expressionRouter


