

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


// log: ['query'] shows the queries
const prisma = new PrismaClient({ adapter, log: [{emit: 'event', level: 'query'}] });

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params) // the missing values thaht didnt appear in the query
  //console.log('Duration: ' + e.duration + 'ms')
})

export default prisma

