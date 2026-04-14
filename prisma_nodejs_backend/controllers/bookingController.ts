
const { Booking, Car } = require('../models')
const { Sequelize, Op } = require('sequelize');
const { isStringInteger, isValidDateYYYYMMDD } = require('../utils/utils');

const _ = require("lodash");


//************************************************************************************
//************************************************************************************

exports.getByCar = async (req, res) => {

    // the minimun required for the route
    if ( (req.params.country!='usa' && req.params.country!='brazil') || 
          ! isStringInteger( req.params.car_id ) ||
          ! isValidDateYYYYMMDD( req.params.firstday ) || 
          ! isValidDateYYYYMMDD( req.params.lastday ) )  {
      res.status(500).send('Invalid route')
      return
    }

    res.setHeader('Content-Type', 'application/json');

    // generates random string to concatenate with the link to the car image and avoid browser cache
    let tempLink = _.random(10000,99999)

    let country = req.params.country

    let fieldsBookingToSelect = [
      'driver_name', 'car_id',  
      ['id', 'booking_id'],
      [
        Sequelize.literal(`if('${country}'='usa', date_format(pickup_datetime, '%m/%d %h:%i - %p'), date_format(pickup_datetime, '%d/%m - %H:%i'))`),
        'pickup_formatted' 
      ],
      [
        Sequelize.literal(`if('${country}'='usa', date_format(dropoff_datetime, '%m/%d %h:%i - %p'), date_format(dropoff_datetime, '%d/%m - %H:%i'))`),
        'dropoff_datetime' 
      ],
      [
        Sequelize.literal(`date_format(pickup_datetime, '%Y-%m-%d|%H:%i')`),
        'pickup_reference' 
      ],
      [
        Sequelize.literal(`date_format(dropoff_datetime, '%Y-%m-%d|%H:%i')`),
        'dropoff_reference' 
      ]
    ]


    let fieldsCarToSelect = [
      'description', 'plate',
      [Sequelize.fn('CONCAT', 'car_', Sequelize.col('Car.id'), '.png?', tempLink), 'car_image']
    ]


    //Car.hasMany(Booking);
    //Booking.belongsTo(Car);

    let where = []

    // car_id= 0 means user click in ALL CARS button
    if ( req.params.car_id!=0 ) {
      where.push( {car_id: req.params.car_id} )
    }

    // run the mounted query

    // search for bookings to use this car (car_id), and whose period is between 'firstday' and 'lastday'

    const bookings = await Booking.findAll({
      attributes: fieldsBookingToSelect , 
      include: [ {
        as: 'Car',
        model: Car,
        required: false, 
        attributes: fieldsCarToSelect,
        raw: true
      } ],
      raw: true,
      where: {
        [Op.and]: [
          where, 
          {
            [Op.or]: [
              Sequelize.where(
                Sequelize.fn('DATE_FORMAT', Sequelize.col('pickup_datetime'), '%Y-%m-%d'), {[Op.between]: [req.params.firstday, req.params.lastday]},
              ),
              Sequelize.where(
                Sequelize.fn('DATE_FORMAT', Sequelize.col('dropoff_datetime'), '%Y-%m-%d'), {[Op.between]: [req.params.firstday, req.params.lastday]},
              ),
            ]
          } 
        ],
      },

    })


    // when you make a join using Sequelize, it puts the name of the table (property: 'as') as a prefix in the name of the 'included' field
    // in the join above, all the fiedls that came from the Car table will start with 'Car.'  , it needs to be remove for the front end to process them
    // I've tried for hour to find a smarter solution for this, but its impossible
    const renamedBookings = bookings.map(item => {
      const { 'Car.description': description, 'Car.plate': plate, 'Car.car_image': car_image, ...rest } = item; 
      return { ...rest, description, plate, car_image };
    });


    res.status(200).json(renamedBookings);
};  




//************************************************************************************
//************************************************************************************

exports.getById = async (req, res) => {

    // the minimun required for the route
    if ( ! isStringInteger( req.params.id ) ) {
      res.status(500).send('Invalid route')
      return
    }

    // generates random string to concatenate with the link to the car image and avoid browser cache
    let tempLink = _.random(10000,99999)

    let country = req.params.country

    // run the mounted query
    const booking = await Booking.findOne({
      where: { id: req.params.id },
      attributes: [
        'car_id', 'driver_name', ['id', 'booking_id'],
          [Sequelize.fn('CONCAT', 'car_', Sequelize.col('car_id'), '.png?', tempLink), 'car_image'],
          [
            Sequelize.literal(`if('${country}'='usa', date_format(pickup_datetime, '%m/%d/%y'), date_format(pickup_datetime, '%d/%m/%y'))`),
            'pickup_date' 
          ],
          [
            Sequelize.literal(`if('${country}'='usa', date_format(dropoff_datetime, '%m/%d/%y'), date_format(dropoff_datetime, '%d/%m/%y'))`),
            'dropoff_date' 
          ],
          [
            Sequelize.literal(`if('${country}'='usa', date_format(pickup_datetime, '%h:%i - %p'), date_format(pickup_datetime, '%H:%i'))`),
            'pickup_hojjjjur' 
          ],
          [
            Sequelize.literal(`if('${country}'='usa', date_format(dropoff_datetime, '%h:%i - %p'), date_format(dropoff_datetime, '%H:%i'))`),
            'dropoff_hour' 
          ],
      ],
      raw: true
    })
    res.setHeader('Content-Type', 'application/json');

    if (booking==null)  {
      res.status(500).send('Invalid route')
      return
    }

    res.status(200).json(booking);
};  



