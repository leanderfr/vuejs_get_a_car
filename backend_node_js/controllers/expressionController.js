
const { Expression } = require('../models')
const { Op } = require('sequelize');

//************************************************************************************
//************************************************************************************

exports.getByCountry = async (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    let fieldsToSelect = []
    let conditions = []
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

      conditions.push( {active: true} )
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
        filterSearchbox.push({ item: req.params.searchbox });
        filterSearchbox.push({ portuguese: req.params.searchbox });
        filterSearchbox.push({ english: req.params.searchbox });
      }

      if (req.params.active=='active') conditions.push( {active: true} )
      if (req.params.active=='inactive') conditions.push( {active: false} )
    }

    // run the mounted query
    const expressions = await Expression.findAll({
      where: {
        [Op.and]: [
          conditions, 
          filterSearchbox.length > 0 ?
          {
            [Op.or]: filterSearchbox 
          } : null
        ],
      },
      attributes: fieldsToSelect , 
      order: [
        ['item', 'ASC']
      ]
    })

    //***********************************************************************************************
    if (req.params.resultformat=='reference') {
      keyedArray = []

      for (const expression of expressions) {
        keyedArray[expression.dataValues.item] = expression.dataValues.language
      }
      res.send( json = Object.assign({}, keyedArray) );
    }

    //***********************************************************************************************
    if (req.params.resultformat=='json') {
      res.json(expressions);
    }
};  



