

//const { Sequelize, Op } = require('sequelize');

import {isStringInteger} from '../utils/utils.ts';
import * as express from 'express'

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from '@prisma/client';


const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port:  3306,
  connectionLimit: 5,
});


//import _ from "lodash";


//************************************************************************************
//************************************************************************************

export const getAll = async (req: express.Request, res: express.Response) => {

    // the minimun required for the route
    if ( (req.params.active!='active' && req.params.active!='inactive' && req.params.active!='all') )  {
      res.status(500).send('Invalid route')
      return
    }

    res.setHeader('Content-Type', 'application/json');

    // generates random string to concatenate with the link to the car image and avoid browser cache
    //let tempLink = _.random(10000,99999)



//    res.status(200).send('TESTE QQ, RECEBIDO ID '+req.params.id)
};  




//************************************************************************************
//************************************************************************************

export const getById = async (req: express.Request, res: express.Response) => {

    // the minimum required for the route
    if ( ! isStringInteger( req.params.id ) ) {
      res.status(500).send('Invalid route')
      return
    }

    // generates random string to concatenate with the link to the car image and avoid browser cache
    //let tempLink = _.random(10000,99999)

//    res.status(200).json(car);
//    res.status(200).send('TESTE QQ, RECEBIDO ID '+req.params.id)



const prisma = new PrismaClient({ adapter });

  try {
    const records = await prisma.bookings.findMany({

      where: {
        id: {equals: Number(req.params.id)},
      },
      include: {
        cars: true
      }

    })
    res.send('sucesso= '+ JSON.stringify(records))


  }
  catch (err) {
    res.send('erro= '+err)

  }
  finally {
console.log('FECHOU APP MESMO...')

    async() => {
      await prisma.$disconnect()
      process.exit(0)
    }


  }

}
