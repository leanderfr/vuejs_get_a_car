
const { Car } = require('../models')

const { Sequelize, Op } = require('sequelize');

const { isStringInteger } = require('../utils/utils');

const _ = require("lodash");



//************************************************************************************
//************************************************************************************

exports.getAll = async (req, res) => {

    // the minimun required for the route
    if ( (req.params.active!='active' && req.params.active!='inactive' && req.params.active!='all') )  {
      res.status(500).send('Invalid route')
      return
    }

    res.setHeader('Content-Type', 'application/json');

    // generates random string to concatenate with the link to the car image and avoid browser cache
    let tempLink = _.random(10000,99999)


    let fieldsToSelect = [
      'description','id', 'plate','active', [Sequelize.fn('CONCAT', 'car_', Sequelize.col('id'), '.png?', tempLink), 'car_image']
    ]

    let where = []
    let filterSearchbox = []

    // search box at the top left corner of datatable
    if (req.params.searchbox) {
      filterSearchbox.push({ description:  { [Op.like]: `%${req.params.searchbox}%`}  });
      filterSearchbox.push({ plate:  { [Op.like]: `%${req.params.searchbox}%`}  });
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

exports.getById = async (req, res) => {

    // the minimum required for the route
    if ( ! isStringInteger( req.params.id ) ) {
      res.status(500).send('Invalid route')
      return
    }

    // generates random string to concatenate with the link to the car image and avoid browser cache
    let tempLink = _.random(10000,99999)


    // run the mounted query
    const car = await Car.findOne({
      where: { id: req.params.id },
      attributes: [ 'description','id', 'plate','active', [Sequelize.fn('CONCAT', 'car_', Sequelize.col('id'), '.png?', tempLink), 'car_image'] ], 
    })

    res.setHeader('Content-Type', 'application/json');

    if (car==null)  {
      res.status(500).send('Invalid route')
      return
    }

    res.status(200).json(car);
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


