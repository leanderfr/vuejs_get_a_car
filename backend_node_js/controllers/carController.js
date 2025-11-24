
const { Car } = require('../models')

//************************************************************************************
//************************************************************************************

exports.getAllCars = async (req, res) => {
    const cars = await Car.findAll({
      where: {
        active: true,
      },
    })
    res.json(cars);
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


