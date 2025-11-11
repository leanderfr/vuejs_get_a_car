
const conexao = require('../database/setup')
class carsModel {

  listar()  {

    const sql = 'select * from supervisores'

    return new Promise((resolve, reject) => { 
      conexao.query(sql, (error, resp) => {
          if (error)  {
              console.log('error ')
              reject(error)
          }
          console.log('rodou')
          resolve(error)

      })
    })

}


}

module.exports = new carsModel()