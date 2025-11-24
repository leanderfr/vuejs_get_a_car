
const { Expression } = require('../models')
const { Op } = require('sequelize');

//************************************************************************************
//************************************************************************************

exports.getByCountry = async (req, res) => {

    let fieldsToSelect = []

    if (req.params.resultformat=='reference') {
      fieldsToSelect.push( 'item' )

      if (req.params.country === 'usa') {
        fieldsToSelect.push( ['english', 'language'] );
      }
      if (req.params.country === 'brazil') {
        fieldsToSelect.push( ['portuguese', 'language'] );
      }

    }

    if (req.params.resultformat=='json') {
      fieldsToSelect.push( 'id', 'active', 'english', 'portuguese' );

      if (req.params.searchbox) {
        conditions.push({ item: req.params.searchbox });
      }
    }

    const conditions = [ {
      active: req.params.active,
    }];

    const expressions = await Expression.findAll({
      where: {[Op.and]: conditions},
      attributes: fieldsToSelect 
    })

    res.setHeader('Content-Type', 'application/json');
    res.json(expressions);
};  



