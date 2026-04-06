
//const fs = require('fs')
//const _ = require('lodash')

const mysql = require('mysql')



/*
const server = http.createServer( (req, res) => {
  res.setHeader('Content-Type','text/plain')

  let num = _.random(0, 30)
  res.end(`num = ${num}`)
  
  
  //res.setHeader('Content-Type','text/html')
  //fs.readFile('./views/index.html', (err, data) => {
    //if (! err) {
      //res.statusCode = 200
      //res.end(data)
    //}
  //})


  //console.log(req.url, req.method)
//  res.write('teste')
//  res.end()

})

server.listen(3000, 'localhost', () => {
  console.log('servidor ok')
})
*/

//app.use('/blogs', routes)

//app.use((req, res) => {
  //res.render('404')
//})



/*
const server = http.createServer( (req, res) => {
  res.setHeader('Content-Type','text/plain')

  let num = _.random(0, 30)
  res.end(`num = ${num}`)
  
  
  //res.setHeader('Content-Type','text/html')
  //fs.readFile('./views/index.html', (err, data) => {
    //if (! err) {
      //res.statusCode = 200
      //res.end(data)
    //}
  //})


  //console.log(req.url, req.method)
//  res.write('teste')
//  res.end()

})

server.listen(3000, 'localhost', () => {
  console.log('servidor ok')
})
*/


//const { Router } = require('express')

//router.post('/', carsController.criar)


//router.get('/cars/:id', carsController.listar)


import conexao from './database/setup'








import conexao from '../database/setup'

export class carsModel {

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














'use strict';

import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize';
import process from 'process';

  import { fileURLToPath } from 'url';
  import { dirname } from 'path';

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  import configData from path.join(__dirname, '/../config/config.json');
  const config = configData[env];


const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
//const config = require(__dirname + '/../config/config.json')[env];



const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default  db
