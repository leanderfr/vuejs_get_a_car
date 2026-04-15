
import {isPositiveInteger} from '../utils/utils.ts';
import * as express  from 'express'

// shared prisma
import prisma from "./connection.ts";


//************************************************************************************
//************************************************************************************

export const getByCountry = async (req: express.Request, res: express.Response) => {

    // the minimun required for the route
    if ( (req.params.resultformat!='reference' && req.params.resultformat!='json') || 
         (req.params.country!='usa' && req.params.country!='brazil') || 
         (req.params.active!='active' && req.params.active!='inactive' && req.params.active!='all') )  {
      res.status(500).send('Invalid route')
      return
    }


    /* when "resultformat=='reference'" =>  response will be  simple keyed json, only active records, based on the language passed in
    example:
    {
      "about_app": "About the app:",
      "add_record": "Add record",
      "allcars": "All Cars",
      "app_header_description __": "HiringMachine PHP Vue Assessment_",
      "app_header_title": "Car Reservation_",
      .........
    }


    /* when "resultformat=='json'" =>  response will be an array of json, filtering the active/inactive, searchbox if filled up, etc
    example:
    [
      {
        id: "74",
        english: "About the app:",
        portuguese: "Sobre a aplicação:",
        item: "about_app",
        active: "1"
        },
      {
        id: "56",
        english: "Add record",
        portuguese: "Novo registro",
        item: "add_record",
        active: "1"
        },    
      ...........
    */
    let records

    // if user specified a text to search (req.params.searchbox), seek it
    // if fetch only active or inactive (req.params.active), filter it


    // for the prisma dont use that comom moron "1=0" condition, the OR has to have an oposite condition
    // tough it is stupid, its needed to use  '{id: {gte: 1}}'
    // thats what I call a moron orm, GORM from goland is way way clever

    res.setHeader('Content-Type', 'application/json');
    try {
       records = await prisma.expressions.findMany({
        where: {
          ...(req.params.active=='active' ? {active: {equals: 1}} : {}),
          ...(req.params.active=='inactive' ? {active: {equals: 0}} : {}),
          OR: [
            (req.params.searchbox ? {
              item: {contains: `%${req.params.searchbox}%`},
              english: {contains: `%${req.params.searchbox}%`},
              portuguese: {contains: `%${req.params.searchbox}%`}
            } : {id: {gte: 1}}),
          ],
        },
        orderBy: {item: 'asc'}

      })

    }
    catch (err) {
      res.status(500).send(err)
      process.exit(1)  // error
    }
    finally {



          //***********************************************************************************************
          // if returns the records in a simpler way (reference), transform the json into a keye interface
          //***********************************************************************************************
          if (req.params.resultformat=='reference') {

            interface keyedArray {
              [key: string]: string;
            }

            // type guards kills a lot of time
            // typescript is a burden 
            if (typeof records!='undefined')  {
              let expressions:keyedArray = {};

              for (const expression of records) {
                if (expression.item!=null && expression.portuguese!=null && expression.english!=null ) {
                  if (req.params.country === 'usa') {
                    expressions[expression.item] = expression.english
                  } 
                  if (req.params.country === 'brazil') {
                    expressions[expression.item] = expression.portuguese
                  } 
                }
              }
              res.status(200).json(expressions);
          }

          //***********************************************************************************************
          // if returns the records in json , just return it
          //***********************************************************************************************
          } else {
            res.status(200).json(records);
          }

          async() => {
            await prisma.$disconnect()
            process.exit(0) // success
          }


          
    }



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
      const records = await prisma.expressions.findFirst({
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

};  




//************************************************************************************
//************************************************************************************

export const update = async (req: express.Request, res: express.Response) => {

    // the minimun required for the route
    if ( ! isStringInteger( req.params.id ) ) {
      res.status(500).send('Invalid route')
      return
    }

const data = req.body;
console.log('dados= '+JSON.stringify(data));
/*
    // run the mounted query
    const expression = await Expression.findOne({
      where: { id: req.params.id },
      attributes: ['item', 'english', 'portuguese'], 
    })

    res.setHeader('Content-Type', 'application/json');

    if (expression==null)  {
      res.status(500).send('Invalid route')
      return
    }
*/
    //res.status(200).json(expression);

 res.type('plain/text');
res.status(200).send('nada')
};  
