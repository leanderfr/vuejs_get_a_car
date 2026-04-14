

import express from 'express'
import morgan from 'morgan'
import cors from 'cors'; // Import the cors middleware
import multer from 'multer';

import "dotenv/config";
//import { PrismaMariaDb } from "@prisma/adapter-mariadb";
//import { PrismaClient } from '@prisma/client';


import carRoutes from './routes/carRoutes.ts'
//import expressionRoutes from './routes/expressionRoutes.ts'
//import bookingRoutes from './routes/bookingRoutes.ts'

const app = express()


// better debug
app.use( morgan('dev') )   

//app.use(express.json());

app.use(cors()); 

const upload = multer(); // For parsing text-only form-data

app.use('/car', carRoutes)
//app.use('/expression', upload.none(), expressionRoutes)
//app.use('/booking',  bookingRoutes)

app.use((req, response) => {
  response.status(404).send('Sorry, that route does not edddxist!');
  return
});


app.listen(3000)

console.log('RODANDO...')
/*
const prisma = new PrismaClient({ adapter });

try {
  await prisma.$connect();
}
catch(e) {
console.log('erro='+e)
}
finally {
  console.log('sucesso AO CONECTAR')
  app.listen(3000)
}





*/
