
const { Car } = require('../models')

const { Sequelize, Op } = require('sequelize');

const { isStringInteger } = require('../utils/utils');



//************************************************************************************
//************************************************************************************

exports.getAll = async (req, res) => {

    // the minimun required for the route
    if ( (req.params.active!='active' && req.params.active!='inactive' && req.params.active!='all') )  {
      res.status(500).send('Error with the router')
      return
    }

    res.setHeader('Content-Type', 'application/json');

    let fieldsToSelect = [
      'description','id', 'plate','active', [Sequelize.fn('CONCAT', 'car_', Sequelize.col('id'), '.png'), 'car_image']
    ]

    let where = []
    let filterSearchbox = []

    // search box at the top left corner of datatable
    if (req.params.searchbox) {
      filterSearchbox.push({ description: req.params.searchbox });
      filterSearchbox.push({ plate: req.params.searchbox });
    }

    if (req.params.active=='active') where.push( {active: true} )
    if (req.params.active=='inactive') where.push( {active: false} )

    // run the mounted query
    const cars = await Car.findAll({
      where: {
        [Op.and]: [
          where, 
          filterSearchbox.length > 0 ?
          {
            [Op.or]: filterSearchbox 
          } : null
        ],
      },
      attributes: fieldsToSelect , 
      order: [
        ['description', 'ASC']
      ]
    })

    res.status(200).json(cars);
};  






//************************************************************************************
//************************************************************************************

exports.novo = async (req, res) => {
    const cars = await Car.create( {  
      description: 'Teste', 
      plate: 'placa',
    })
    .then(user => {
        console.log('User created successfully:', user.toJSON());
        res.end
      })
    .catch((err)=> {
      console.log(err)
    })

};


