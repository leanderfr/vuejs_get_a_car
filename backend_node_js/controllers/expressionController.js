
const { Expression } = require('../models')
const { Op } = require('sequelize');

//************************************************************************************
//************************************************************************************

exports.getByCountry = async (req, res) => {
    let fieldsToSelect = ['id', 'item', 'active'];

    if (req.params.country === 'usa') {
      fieldsToSelect.push( ['english', 'language'] );
    }
    if (req.params.country === 'brazil') {
      fieldsToSelect.push( ['portuguese', 'language'] );
    }

    const conditions = [ {
      active: req.params.active,
    }];

    if (req.params.searchbox) {
      conditions.push({ item: req.params.searchbox });
    }

    const expressions = await Expression.findAll({
      where: {[Op.and]: conditions},
      attributes: fieldsToSelect 
    })
    res.json(expressions);
};  



