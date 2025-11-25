
const { Booking, Car } = require('../models')
const { Sequelize, Op } = require('sequelize');
const { isStringInteger, isValidDateYYYYMMDD, removeSequelizeJsonPrefix } = require('../utils/utils');

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
      'driver_name','id', 'car_id',  
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

    // run the mounted query
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
    })

const renamedBookings = bookings.map(item => {
  const { 'Car.description': description, ...rest } = item; 
  return { description, ...rest };
});


//    const arr = JSON.parse(bookings.toJSON());
  //  bookings.forEach( obj => removeSequelizeJsonPrefix( obj, 'Car.' ) );
    //const updatedJson = JSON.stringify( bookings );

    res.status(200).json(renamedBookings);
};  



