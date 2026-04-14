
import express from 'express'

import * as carController from '../controllers/carController.ts'

const carRouter = express.Router()

// optional searchbox came
carRouter.get('/list/:active/:searchbox', carController.getAll)  

// no searchbox
carRouter.get('/list/:active', carController.getAll)  

carRouter.get('/:id', carController.getById)

export default carRouter


