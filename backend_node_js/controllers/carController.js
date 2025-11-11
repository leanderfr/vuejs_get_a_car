
const carModel = require('../models/carModel')

class carsController {
/*
      const blogsIndex = (req, res) => {
        //res.send('teste 123...')
      //  res.sendFile('./views/index.html', {root: __dirname})
        res.send(req.body.name+'<br>'+req.body.email)
      //  res.end('** executado ** ')
      }
*/

  listar() {

    return carModel.listar()

  }
}

module.exports = new carsController()
  