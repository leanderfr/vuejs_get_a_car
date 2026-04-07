
import * as utils from './utils'
import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from '@prisma/client';
//require('dotenv').config()

//const moment = require('moment');
import moment from 'moment';


const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port:  3306,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {

  try {

    const res = await prisma.bookings.findMany({

      where: {
        driver_name: {contains: 'Leander'},
      },
      include: {
        cars: true
      }

    })
    console.log('sucesso= '+ JSON.stringify(res))
  }
  catch (err) {
    console.log('erro= '+err)
  }
  finally {
    async() => {
      await prisma.$disconnect()
    }

  }
    process.exit(0)

}


main()