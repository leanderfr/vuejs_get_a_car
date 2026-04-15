

import {isPositiveInteger} from '../utils/utils.ts';
import * as express from 'express'

// shared prisma
import prisma from "./connection.ts";


//************************************************************************************
//************************************************************************************

export const getAll = async (req: express.Request, res: express.Response) => {

    // the minimun required for the route
    if ( (req.params.active!='active' && req.params.active!='inactive' && req.params.active!='all') )  {
      res.status(500).send('Invalid route')
      return
    }

    res.setHeader('Content-Type', 'application/json');

};  




//************************************************************************************
//************************************************************************************

export const getById = async (req: express.Request, res: express.Response) => {

    // the minimum required for the route
    if ( ! isPositiveInteger( req.params.id ) ) {
      res.status(500).send('Invalid route parameter')
      return
    }

    res.setHeader('Content-Type', 'application/json');
    try {
      const records = await prisma.cars.findFirst({
        where: {
          id: {equals: Number(req.params.id)},
        },
      })
      res.status(200).json(records);
    }
    catch (err) {
      res.status(500).send(err)
    }
    finally {
      async() => {
        await prisma.$disconnect()
        process.exit(0)
      }
    }

}
