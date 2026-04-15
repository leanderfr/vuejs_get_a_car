
import {isPositiveInteger} from '../utils/utils.ts';
import {Request, Response} from 'express'

// shared prisma
import prisma from "./connection.ts";


//************************************************************************************
//************************************************************************************

//export const getByCountry = async (req: Request, res: Response) => {
export const getByCountry = async (req, res) => {

    // the minimun required for the route
    if ( (req.params.resultformat!='reference' && req.params.resultformat!='json') || 
         (req.params.country!='usa' && req.params.country!='brazil') || 
         (req.params.active!='active' && req.params.active!='inactive' && req.params.active!='all') )  {
      res.status(500).send('Invalid route')
      return
    }

    let fieldsToSelect = []
    let where = []
    let filterSearchbox = []


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
    */
    if (req.params.resultformat=='reference') {
      fieldsToSelect.push( 'item' )

      if (req.params.country === 'usa') {
        fieldsToSelect.push( ['english', 'language'] );
      }
      if (req.params.country === 'brazil') {
        fieldsToSelect.push( ['portuguese', 'language'] );
      }

      where.push( {active: true} )
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

    if (req.params.resultformat=='json') {
      fieldsToSelect.push( 'id', 'active', 'english', 'portuguese' );

      // search box at the top left corner of datatable
      if (req.params.searchbox) {
        filterSearchbox.push({ item: { 'contains': `%${req.params.searchbox}%`}  });
        filterSearchbox.push({ portuguese: { 'contains': `%${req.params.searchbox}%`}  });
        filterSearchbox.push({ english: { 'contains': `%${req.params.searchbox}%`}  });
      }

      if (req.params.active=='active') where.push( {active: {equals: true}} )
      if (req.params.active=='inactive') where.push( {active: {equals: false}} )
    }

    res.setHeader('Content-Type', 'application/json');
    try {
      const records = await prisma.expressions.findMany({
        where: {
          ...(filterSearchbox ? filterSearchbox : {}),
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



    //***********************************************************************************************
    if (req.params.resultformat=='reference') {
      let keyedArray = []

      // converts to a simpler keyed json
      for (const expression of expressions) {
        keyedArray[expression.dataValues.item] = expression.dataValues.language
      }
      res.status(200).send( json = Object.assign({}, keyedArray) );
      return
    }

    //***********************************************************************************************
    if (req.params.resultformat=='json') {
      res.status(200).json(expressions);
      return
    }
};  




//************************************************************************************
//************************************************************************************

//export const getById = async (req: Request, res: Response) => {
export const getById = async (req, res) => {

    // the minimun required for the route
    if ( ! isStringInteger( req.params.id ) ) {
      res.status(500).send('Invalid route')
      return
    }

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

    res.status(200).json(expression);
};  




//************************************************************************************
//************************************************************************************

//export const update = async (req: Request, res: Response) => {
export const update = async (req, res) => {

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
