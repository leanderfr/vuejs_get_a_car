
import * as utils from './utils'
//import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from '@prisma/client';
require('dotenv').config()

//const moment = require('moment');
const moment = require('moment-timezone');

//console.log('aa='+process.env.DATABASE_HOST)



const timezone = moment.tz.guess(); 
console.log(timezone); // Outputs your system's IANA timezone
console.log( moment().format()  )
console.log( moment()  )
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
    await prisma.$executeRaw`SET time_zone = '-03:00'`;
    console.log('✅ Timezone configured for America/Sao_Paulo');
  } catch (error) {
    console.error('❌ Error configuring timezone:', error);
  }


  try {
    const res = await prisma.bookings.createMany({
      data: [
        { pickup_datetime: moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"), dropoff_datetime: moment(), car_id: utils.getRandomInt(1,5), driver_name: 'Fabian Fruchting',
      }], skipDuplicates: true

    })
    console.log('sucesso= '+res)
  }
  catch (err) {
    console.log('erro= '+err)
  }
  finally {
    async() => {
      await prisma.$disconnect()
    }

  }

}


main()