import { PrismaClient } from '@prisma/client'
import { networkInterfaces } from 'node:os'

const prisma = new PrismaClient()

async function main() {

  try {
    const res = await prisma.bookings.createMany({
      data: [ {dropoff_datetime: networkInterfaces()} ]
    })
  }
  catch (err) {

  }

}